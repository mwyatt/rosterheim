import React from "react";
import Stat from "./warrior/stat";
import ClosePill from "./closePill";

export default function Warrior({
  warrior,
  warriorIndex,
  warriorTemplates,
  warriorTypes,
  equipments,
  handleChangeWarrior,
  handleQtyChoose,
  handleEquipmentChoose,
  handleEquipmentRemove,
  handleWarriorRemove,
  moveEquipmentToStash,
  rules,
  getWarriorRuleNames,
}) {
  const warriorTemplate = warriorTemplates.find(
    (item) => item.type === warrior.warriorTemplateType,
  );
  const warriorType = warriorTypes.find(
    (item) => item.isHero === warriorTemplate.isHero,
  );

  const getRules = () => {
    const ruleNames = getWarriorRuleNames(warrior);
    return rules.filter((rule) => ruleNames.includes(rule.name));
  };

  const getExpTable = () => {
    const output = [];
    for (let i = 1; i < warriorType.expAvailable + 1; i += 1) {
      const filled = warrior.exp + warriorTemplate.startExp >= i;
      const advance = warriorType.expAdvances.find(
        (expAdvance) => expAdvance === i,
      );
      const classNames = [
        filled ? "bg-slate-300" : "",
        "border",
        "p-2",
        "m-0.5 my-0",
        "w-2",
        advance ? "border-slate-500" : "border-slate-300",
      ];
      output.push(
        <span
          key={i}
          className={classNames.join(" ")}
          style={{
            display: "inline-block",
          }}
        />,
      );
    }
    return output;
  };

  return (
    <div className="mb-3 break-inside-avoid">
      <div className="text-right print:hidden">
        <button
          type="button"
          className="text-rose-700 text-3xl"
          onClick={() => handleWarriorRemove(warriorIndex)}
        >
          &times;
        </button>
      </div>
      <div className="border border-black sm:flex">
        <div className="border-r border-black">
          <div className="border-b border-black flex p-1">
            <span className="uppercase mr-2">Name</span>
            <input
              required
              className="print:hidden px-1 py-0 border-none"
              type="text"
              onChange={function _(e) {
                handleChangeWarrior(warriorIndex, "name", e.target.value);
              }}
              value={warrior.name}
            />
            <span className="screen:hidden print:show">{warrior.name}</span>
          </div>
          <div className="flex border-b border-black">
            <div className="border-r border-black p-1 pr-2">
              <span className="uppercase pr-2">Number</span>
              <span
                className={[warriorTemplate.isHero ? "" : "screen:hidden"].join(
                  " ",
                )}
              >
                {warrior.qty}
              </span>
              <select
                defaultValue={warrior.qty}
                className={[
                  "print:hidden",
                  warriorTemplate.isHero ? "hidden" : "",
                ].join(" ")}
                name="qty"
                onChange={(e) => handleQtyChoose(warriorIndex, e.target.value)}
              >
                {Array.from(Array(3).keys()).map((number) => (
                  <option value={number + 1} key={number + 1}>
                    {number + 1}
                  </option>
                ))}
              </select>
            </div>
            <div className="p-1">
              <span className="uppercase pr-2">Type</span>{" "}
              {warriorTemplate.type}
            </div>
          </div>
          <div className="flex">
            {Object.keys(warriorTemplate.stats).map(
              (warriorTemplateStatKey) => (
                <Stat
                  key={warriorTemplateStatKey}
                  warriorTemplateStatKey={warriorTemplateStatKey}
                  warriorTemplateStatValue={
                    warriorTemplate.stats[warriorTemplateStatKey]
                  }
                  warrior={warrior}
                  warriorIndex={warriorIndex}
                  handleChangeWarrior={handleChangeWarrior}
                />
              ),
            )}
          </div>
          <div className="flex p-1 gap-2 print:hidden">
            <div className="flex-1">
              <select
                className="print:hidden p-1 border border-black rounded w-full"
                onChange={function _(e) {
                  if (e.target.value === "") return;
                  handleChangeWarrior(warriorIndex, "rules", [
                    ...new Set([...warrior.rules, e.target.value]),
                  ]);
                }}
              >
                <option value="">Add Injury</option>

                {rules.map((rule) => {
                  if (rule.type === "injury") {
                    return (
                      <option value={rule.name} key={rule.name}>
                        {rule.name}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>
            <div className="flex-1">
              <select
                className="print:hidden p-1 border border-black rounded w-full"
                onChange={function _(e) {
                  if (e.target.value === "") return;
                  handleChangeWarrior(warriorIndex, "rules", [
                    ...new Set([...warrior.rules, e.target.value]),
                  ]);
                }}
              >
                <option value="">Add Skill</option>

                {rules.map((rule) => {
                  if (
                    rule.type === "skill" &&
                    (rule.warbandType === warriorTemplate.warbandType ||
                      rule.warbandType === "")
                  ) {
                    return (
                      <option value={rule.name} key={rule.name}>
                        {rule.name}
                      </option>
                    );
                  }
                  return null;
                })}
              </select>
            </div>
          </div>
          <div className="flex gap-1 m-1">
            {warrior.rules.map((injury) => (
              <ClosePill
                key={injury}
                name={injury}
                handleClick={() => {
                  handleChangeWarrior(warriorIndex, "rules", [
                    ...warrior.rules.filter(
                      (warriorInjury) => warriorInjury !== injury,
                    ),
                  ]);
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-grow">
          <div className="border-r border-black p-2">
            <h2 className="uppercase mb-2">Equipment</h2>
            <select
              className="print:hidden max-w-16 p-1 border border-black rounded"
              onChange={(e) =>
                handleEquipmentChoose(warriorIndex, e.target.value)
              }
            >
              <option value="">Add</option>
              {equipments.map((equipment) => (
                <option value={equipment.name} key={equipment.name}>
                  {equipment.name}
                </option>
              ))}
            </select>
            {/*<button*/}
            {/*  type="button"*/}
            {/*  onClick={() => moveEquipmentToStash(warriorIndex)}*/}
            {/*>*/}
            {/*  Transfer to stash*/}
            {/*</button>*/}
            <div className="flex flex-wrap gap-1 mt-1">
              {warrior.equipments.map(
                (warriorEquipmentName, warriorEquipmentIndex) => (
                  <ClosePill
                    key={warriorEquipmentName}
                    name={warriorEquipmentName}
                    handleClick={() =>
                      handleEquipmentRemove(warriorIndex, warriorEquipmentIndex)
                    }
                  />
                ),
              )}
            </div>
          </div>
          <div className="p-2 flex-grow">
            <h3 className="uppercase mb-2">Special Rules</h3>
            <div className="flex flex-wrap gap-1">
              {getRules().map((rule) => (
                <ClosePill name={rule.name} key={rule.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-l border-r border-b border-black p-2">
        <div className="flex mb-2 w-20 h-6 print:hidden">
          <button
            className="text-xl border border-black leading-none flex-1 text-center rounded"
            type="button"
            onClick={function _() {
              handleChangeWarrior(warriorIndex, "exp", warrior.exp - 1);
            }}
          >
            -
          </button>
          <span className="flex-1 text-center">
            {warriorTemplate.startExp + warrior.exp}
          </span>
          <button
            className="text-xl border border-black flex-1 leading-none text-center rounded"
            type="button"
            onClick={function _() {
              handleChangeWarrior(warriorIndex, "exp", warrior.exp + 1);
            }}
          >
            +
          </button>
        </div>
        <div>{getExpTable()}</div>
      </div>
    </div>
  );
}
