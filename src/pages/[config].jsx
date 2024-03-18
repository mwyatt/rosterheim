import React, { useEffect, useState } from "react";
import warriorTemplates from "../data/warriorTemplates.json";
import warbandTypes from "../data/warbandTypes.json";
import warriorTypes from "../data/warriorTypes.json";
import equipments from "../data/equipment.json";
import rules from "../data/rules.json";
import Name from "../components/warband/name";
import Type from "../components/warband/type";
import Warrior from "../components/warband/warrior";
import ClosePill from "../components/warband/closePill";

export default function IndexPage({ params }) {
  const startingGold = 500;
  const [feedback, setFeedback] = useState();
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    warriors: [],
    equipments: [],
    wyrdstone: 0,
    gold: 0,
  });
  const [inputData, setInputData] = useState({
    gold: 0,
    wyrdstone: 0,
    costBreakdownOpen: false,
  });

  const [filteredWarriorTemplates, setFilteredWarriorTemplates] = useState([]);

  const moveEquipmentToStash = (warriorIndex) => {
    const warrior = formData.warriors[warriorIndex];
    const equipment = warrior.equipments.pop();
    setFormData({
      ...formData,
      equipments: [...formData.equipments, equipment],
    });
  };

  const getWyrdstoneValue = () => {
    const warLen = formData.warriors.length;
    const selling = inputData.wyrdstone;
    const sellMap = [
      {
        check(warCount) {
          return warCount <= 3;
        },
        1: 45,
        2: 60,
        3: 75,
        4: 90,
        5: 110,
        6: 120,
        7: 145,
        8: 155,
      },
      {
        check(warCount) {
          return warCount <= 6;
        },
        1: 40,
        2: 55,
        3: 70,
        4: 80,
        5: 100,
        6: 110,
        7: 130,
        8: 140,
      },
      {
        check(warCount) {
          return warCount <= 9;
        },
        1: 35,
        2: 50,
        3: 65,
        4: 70,
        5: 90,
        6: 100,
        7: 120,
        8: 130,
      },
      {
        check(warCount) {
          return warCount <= 12;
        },
        1: 30,
        2: 45,
        3: 60,
        4: 65,
        5: 80,
        6: 90,
        7: 110,
        8: 120,
      },
      {
        check(warCount) {
          return warCount <= 15;
        },
        1: 30,
        2: 40,
        3: 55,
        4: 60,
        5: 70,
        6: 80,
        7: 100,
        8: 110,
      },
      {
        check(warCount) {
          return warCount >= 16;
        },
        1: 25,
        2: 35,
        3: 50,
        4: 55,
        5: 65,
        6: 70,
        7: 90,
        8: 100,
      },
    ];
    for (let i = 0; i < sellMap.length; i += 1) {
      if (sellMap[i].check(warLen)) {
        if (selling > 8) {
          return sellMap[i][8];
        }
        return sellMap[i][selling];
      }
    }
    throw new Error("Unexpected wyrdstone value calculation error.");
  };

  const sellWyrdstone = () => {
    if (inputData.wyrdstone < 1 || formData.wyrdstone < inputData.wyrdstone) {
      return;
    }

    const value = getWyrdstoneValue();

    setFeedback(`Sold ${inputData.wyrdstone} wyrdstone for ${value} gold`);

    setFormData({
      ...formData,
      wyrdstone: formData.wyrdstone - parseInt(inputData.wyrdstone, 10),
      gold: formData.gold + value,
    });
    setInputData({
      ...inputData,
      wyrdstone: 0,
    });
  };

  const getCostRows = () => {
    const costRows = [];

    formData.warriors.map((warrior) => {
      const warriorTemplate = warriorTemplates.find(
        (item) => item.type === warrior.warriorTemplateType,
      );

      for (let i = 0; i < warrior.qty; i += 1) {
        costRows.push({
          name: warriorTemplate.type,
          gold: warriorTemplate.gold,
        });

        warrior.equipments.map((equipmentName) => {
          const equipment = equipments.find(
            (item) => item.name === equipmentName,
          );
          costRows.push({
            name: equipment.name,
            gold: equipment.gold,
          });

          return null;
        });
      }

      return null;
    });

    return costRows;
  };

  const calculateRemainingGold = () => {
    const costRows = getCostRows();
    const totalGold = costRows.reduce(
      (total, costRow) => total + costRow.gold,
      0,
    );
    return startingGold + formData.gold - totalGold;
  };

  const getWarriorRuleNames = (warrior) => {
    const warriorTemplate = warriorTemplates.find(
      (item) => item.type === warrior.warriorTemplateType,
    );
    let ruleNames = warriorTemplate.rules;
    warrior.equipments.forEach((equipmentName) => {
      const equipment = equipments.find((item) => item.name === equipmentName);
      ruleNames = ruleNames.concat(equipment.rules);
    });
    warrior.rules.forEach((ruleName) => {
      ruleNames = ruleNames.concat(ruleName);
    });
    return ruleNames;
  };

  const getUniqueRules = () => {
    const ruleNames = formData.warriors.reduce(
      (items, warrior) => items.concat(getWarriorRuleNames(warrior)),
      [],
    );
    return rules.filter((rule) => ruleNames.includes(rule.name));
  };

  const getUniqueEquipment = () => {
    const equipmentNames = formData.warriors.reduce(
      (items, warrior) => items.concat(warrior.equipments),
      [],
    );
    return equipments.filter((equipment) =>
      equipmentNames.includes(equipment.name),
    );
  };

  const getTotalExperience = () =>
    formData.warriors.reduce((total, warrior) => {
      const warriorTemplate = warriorTemplates.find(
        (item) => item.type === warrior.warriorTemplateType,
      );
      return total + warrior.exp + warriorTemplate.startExp;
    }, 0);

  const getMemberCount = () =>
    formData.warriors.reduce((total, warrior) => total + warrior.qty, 0);

  const getWarbandRating = () => {
    let totalWarriorExp = 0;
    totalWarriorExp = formData.warriors.reduce((total, warrior) => {
      const warriorTemplate = warriorTemplates.find(
        (item) => item.type === warrior.warriorTemplateType,
      );
      return total + (warrior.exp + warriorTemplate.startExp) * warrior.qty;
    }, 0);
    return getMemberCount() * 5 + totalWarriorExp;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const filterWarriorTemplates = (type) => {
    setFilteredWarriorTemplates([
      ...warriorTemplates.filter(
        (warriorTemplate) => warriorTemplate.warbandType === type,
      ),
    ]);
  };

  const handleChangeType = (e) => {
    filterWarriorTemplates(e.target.value);
    handleChange(e);
  };

  const handleChangeWarrior = (index, key, value) => {
    formData.warriors[index][key] = value;
    setFormData({ ...formData });
  };

  const handleSubmit = () => {
    const json = JSON.stringify(formData);
    const base64 = btoa(json);

    // console.log({
    //   length: base64.length,
    //   base64,
    //   json,
    //   formData,
    // });

    window.history.pushState("", "", `${window.location.origin}/${base64}`);
  };

  const handleWarriorTemplateChoose = (warriorTemplateType) => {
    if (!warriorTemplateType) return;
    const warriorTemplate = warriorTemplates.find(
      (item) => item.type === warriorTemplateType,
    );

    formData.warriors = [
      ...formData.warriors,
      {
        warriorTemplateType: warriorTemplate.type,
        equipments: [],
        rules: [],
        name: "",
        qty: 1,
        exp: 0,
        stats: {},
      },
    ];
    setFormData({ ...formData });
  };

  const handleQtyChoose = (warriorIndex, qty) => {
    formData.warriors[warriorIndex].qty = parseInt(qty, 10);
    setFormData({ ...formData });
  };

  const handleEquipmentChoose = (warriorIndex, equipmentName) => {
    if (!equipmentName) return;
    const alreadyAssigned = formData.warriors[warriorIndex].equipments.find(
      (item) => item === equipmentName,
    );
    if (alreadyAssigned) return;
    formData.warriors[warriorIndex].equipments = [
      ...formData.warriors[warriorIndex].equipments,
      equipmentName,
    ];
    setFormData({ ...formData });
  };

  const handleEquipmentRemove = (warriorIndex, warriorEquipmentIndex) => {
    formData.warriors[warriorIndex].equipments.splice(warriorEquipmentIndex, 1);
    setFormData({ ...formData });
  };

  const handleWarriorRemove = (index) => {
    formData.warriors.splice(index, 1);
    setFormData({ ...formData });
  };

  useEffect(() => {
    const encoded = params.config;
    if (encoded) {
      const json = atob(encoded);
      try {
        const data = JSON.parse(json);
        setFormData(data);
        filterWarriorTemplates(data.type);
      } catch (e) {
        setFeedback("Invalid warband data in URL.");
      }
    }
  }, []);

  useEffect(() => {
    handleSubmit();
  }, [formData]);

  return (
    <div className="max-w-6xl mx-auto screen:sm:p-6 p-2">
      <div>{feedback}</div>
      <div className="sm:flex gap-6 mb-4">
        <div className="border flex flex-1 p-2 border-black">
          <Name handleChange={handleChange} name={formData.name} />
        </div>
        <div className="border flex flex-2 p-2 border-black">
          <Type
            handleChangeType={handleChangeType}
            warbandTypes={warbandTypes}
            type={formData.type}
          />
        </div>
      </div>
      <div className="sm:flex gap-6 mb-4">
        <div
          className={[
            " border p-2 border-black",
            formData.equipments.length ? "flex-none" : "flex-1",
          ].join(" ")}
        >
          <h2 className="uppercase text-center">Treasury:</h2>
          <div className="border-b border-slate-300 mb-2 pb-2">
            <p>
              Gold crowns:
              {calculateRemainingGold()}
            </p>
            <div>
              <button
                type="button"
                className="rounded border border-black px-1 m-1 print:hidden"
                onClick={() =>
                  setInputData({
                    ...inputData,
                    costBreakdownOpen: !inputData.costBreakdownOpen,
                  })
                }
              >
                {inputData.costBreakdownOpen ? "Hide" : "Show"} Breakdown
              </button>

              <div>
                {inputData.costBreakdownOpen && (
                  <>
                    <div>
                      Starting Gold
                      {startingGold}
                    </div>
                    <div>
                      Added Gold
                      {formData.gold}
                    </div>

                    {getCostRows().map((costRow) => (
                      <div key={[costRow.name, costRow.gold].join("-")}>
                        <span>{costRow.name}</span> -{costRow.gold}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
            <input
              className="rounded px-1 border border-slate-400 w-20 mr-1 print:hidden"
              type="number"
              value={inputData.gold}
              onChange={(e) =>
                setInputData({
                  ...inputData,
                  gold: parseInt(e.target.value, 10),
                })
              }
            />
            <button
              type="button"
              className="rounded border border-black px-1 m-1 print:hidden"
              onClick={() => {
                setFormData({
                  ...formData,
                  gold: formData.gold + parseInt(inputData.gold, 10),
                });
                setInputData({
                  ...inputData,
                  gold: 0,
                });
              }}
            >
              Add
            </button>
            <button
              type="button"
              className="rounded border border-black px-1 m-1 print:hidden"
              onClick={() => {
                setFormData({
                  ...formData,
                  gold: formData.gold - parseInt(inputData.gold, 10),
                });
                setInputData({
                  ...inputData,
                  gold: 0,
                });
              }}
            >
              Remove
            </button>
          </div>

          <p>
            Wyrdstone shards:
            {formData.wyrdstone}
          </p>
          <input
            className="rounded px-1 border border-slate-400 w-20 mr-1 print:hidden"
            type="number"
            value={inputData.wyrdstone}
            onChange={(e) =>
              setInputData({
                ...inputData,
                wyrdstone: parseInt(e.target.value, 10),
              })
            }
          />
          <button
            type="button"
            className="rounded border border-black px-1 m-1 print:hidden"
            onClick={() => {
              setFormData({
                ...formData,
                wyrdstone:
                  formData.wyrdstone + parseInt(inputData.wyrdstone, 10),
              });
              setInputData({
                ...inputData,
                wyrdstone: 0,
              });
            }}
          >
            Add
          </button>
          <button
            type="button"
            className="rounded border border-black px-1 m-1 print:hidden"
            onClick={sellWyrdstone}
          >
            Sell
          </button>
        </div>
        <div
          className={[
            " border p-2 border-black",
            formData.equipments.length ? "flex-none" : "flex-1",
          ].join(" ")}
        >
          <h2 className="uppercase">Rating:</h2>
          <p>
            Total experience:
            {getTotalExperience()}
          </p>
          <p className="border-b border-slate-300 pb-2 mb-2">
            Members
            {getMemberCount()} &times; 5
          </p>
          <p>
            Rating:
            {getWarbandRating()}
          </p>
        </div>
        <div
          className={[
            "flex-1 border p-2 border-black",
            formData.equipments.length ? "" : "print:hidden",
          ].join(" ")}
        >
          <h2 className="uppercase">Stored Equipment:</h2>
          <select
            className="print:hidden max-w-16 p-1 border border-black rounded"
            onChange={(e) => {
              if (e.target.value === "") return;
              setFormData({
                ...formData,
                equipments: [
                  ...formData.equipments,
                  equipments.find(
                    (equipment) => equipment.name === e.target.value,
                  ).name,
                ],
              });
            }}
          >
            <option value="">Add</option>
            {equipments.map((equipment) => (
              <option value={equipment.name} key={equipment.name}>
                {equipment.name}
              </option>
            ))}
          </select>
          <div className="flex flex-wrap gap-1 mt-1">
            {formData.equipments.map((equipmentName, index) => (
              <ClosePill
                key={equipmentName}
                name={equipmentName}
                handleClick={() => {
                  formData.equipments.splice(index, 1);
                  setFormData({ ...formData });
                }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="mb-4 print:hidden text-center">
        <select
          className="print:hidden p-1 border border-black rounded"
          onChange={(e) => handleWarriorTemplateChoose(e.target.value)}
        >
          <option value="">Add Warrior</option>
          {filteredWarriorTemplates.map((warriorTemplate) => (
            <option value={warriorTemplate.type} key={warriorTemplate.type}>
              {warriorTemplate.type} -
              {warriorTemplate.isHero ? "Hero" : "Henchman"}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        {formData.warriors.map((warrior, warriorIndex) => (
          <Warrior
            warrior={warrior}
            warriorIndex={warriorIndex}
            key={[warrior.name, warrior.warriorTemplateType, warriorIndex].join(
              "-",
            )}
            warriorTemplates={warriorTemplates}
            warriorTypes={warriorTypes}
            equipments={equipments}
            handleChangeWarrior={handleChangeWarrior}
            handleQtyChoose={handleQtyChoose}
            handleEquipmentChoose={handleEquipmentChoose}
            handleEquipmentRemove={handleEquipmentRemove}
            handleWarriorRemove={handleWarriorRemove}
            moveEquipmentToStash={moveEquipmentToStash}
            rules={rules}
            getWarriorRuleNames={getWarriorRuleNames}
          />
        ))}
      </div>
      <div>
        <h3 className="text-center text-lg mb-3">Equipment</h3>
        {getUniqueEquipment().map((equipment) => (
          <p key={equipment.name} className="my-1">
            <span className="rounded bg-gray-200 m-1 px-1">
              {equipment.name}
            </span>{" "}
            {equipment.description}
            {equipment.rules.map((ruleName) => (
              <span key={ruleName} className="rounded bg-gray-200 m-1 px-1">
                {ruleName}
              </span>
            ))}
          </p>
        ))}
      </div>
      <div>
        <h3 className="text-center text-lg mb-3 mt-4">Rules</h3>
        {getUniqueRules().map((rule) => (
          <p className="my-1" key={rule.name}>
            <span className="rounded bg-gray-200 m-1 px-1">{rule.name}</span>{" "}
            {rule.description}
          </p>
        ))}
      </div>
    </div>
  );
}
