import {useEffect, useState} from "react"
import React from "react"
import warriorTemplates from "../data/warriorTemplates.json"
import warbandTypes from "../data/warbandTypes.json"
import warriorTypes from "../data/warriorTypes.json"
import equipments from "../data/equipment.json"
import rules from "../data/rules.json"
import Name from "../components/warband/name"
import Type from "../components/warband/type"
import Warrior from "../components/warband/warrior"

export default function ConfigPage () {
    const [feedback, setFeedback] = useState()
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        warriors: [],
        equipments: [],
        wyrdstone: 0,
        gold: 0,
    });
    const [inputData, setInputData] = useState({
        gold: 0,
        wyrdstone: 0,
    });

    // console.log(formData);

    const [filteredWarriorTemplates, setFilteredWarriorTemplates] = useState([]);

    useEffect(() => {
        // window.location.search.substr(3)

        const encoded = new URLSearchParams(window.location.search).get('c');
        if (encoded) {
            const json = atob(encoded);
            try {
                const data = JSON.parse(json);
                setFormData(data);
                filterWarriorTemplates(data.type)
            } catch (e) {
                setFeedback('Invalid warband data in URL.')
            }
        }

        // return
        //
        // const json = localStorage.getItem('warband');
        // if (json) {
        //     const data = JSON.parse(json);
        //     setFormData(data);
        //     filterWarriorTemplates(data.type)
        // }
    }, []);

    useEffect(() => {
        handleSubmit()
    }, [formData]);

    const getWyrdstoneValue = () => {
        const warLen = formData.warriors.length
        const selling = inputData.wyrdstone
        const sellMap = [
            {
                check: function(warCount) {
                    return warCount <= 3
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
                check: function(warCount) {
                    return warCount <= 6
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
                check: function(warCount) {
                    return warCount <= 9
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
                check: function(warCount) {
                    return warCount <= 12
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
                check: function(warCount) {
                    return warCount <= 15
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
                check: function(warCount) {
                    return warCount >= 16
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
        ]
        for (let i = 0; i < sellMap.length; i++) {
            if (sellMap[i].check(warLen)) {
                if (selling > 8) {
                    return sellMap[i][8]
                } else {
                    return sellMap[i][selling]
                }
            }
        }
    }

    const sellWyrdstone = () => {
        if (inputData.wyrdstone < 1 || (formData.wyrdstone < inputData.wyrdstone)) {
            return;
        }

        const value = getWyrdstoneValue()

        setFeedback(`Sold ${inputData.wyrdstone} wyrdstone for ${value} gold`)

        setFormData({
            ...formData,
            wyrdstone: formData.wyrdstone - parseInt(inputData.wyrdstone),
            gold: formData.gold + value
        })
        setInputData({
            ...inputData,
            wyrdstone: 0
        })
    }

    const calculateRemainingGold = () => {
        const totalGold = formData['warriors'].reduce((total, warrior) => {
            const warriorTemplate = warriorTemplates.find(
                warriorTemplate => warriorTemplate.type === warrior['warriorTemplateType']
            )
            const warriorEquipmentCost = warrior['equipments'].reduce((total, equipmentName) => {
                const equipment = equipments.find(equipment => equipment.name === equipmentName);
                return total + equipment.gold;
            }, 0);
            return total + warrior['qty'] * (warriorTemplate.gold + warriorEquipmentCost);
        }, 0);
        return (500 + formData.gold) - totalGold;
    }

    const getWarriorRuleNames = (warrior) => {
        const warriorTemplate = warriorTemplates.find(
            warriorTemplate => warriorTemplate.type === warrior.warriorTemplateType
        )
        let ruleNames = warriorTemplate.rules
        warrior.equipments.forEach(equipmentName => {
            const equipment = equipments.find(equipment => equipment.name === equipmentName);
            ruleNames = ruleNames.concat(equipment.rules);
        });
        warrior.rules.forEach(ruleName => {
            ruleNames = ruleNames.concat(ruleName);
        })
        return ruleNames;
    }

    const getUniqueRules = () => {
        const ruleNames = formData.warriors.reduce((ruleNames, warrior) => {
            return ruleNames.concat(getWarriorRuleNames(warrior));
        }, [])
        return rules.filter(rule => ruleNames.includes(rule.name));
    }

    const getUniqueEquipment = () => {
        const equipmentNames = formData.warriors.reduce((equipmentNames, warrior) => {
            return equipmentNames.concat(warrior.equipments);
        }, [])
        return equipments.filter(equipment => equipmentNames.includes(equipment.name));
    }

    const getTotalExperience = () => {
        return formData['warriors'].reduce((total, warrior) => {
            const warriorTemplate = warriorTemplates.find(
                warriorTemplate => warriorTemplate.type === warrior.warriorTemplateType
            )
            return total + warrior.exp + warriorTemplate.startExp;
        }, 0);
    }

    const getMemberCount = () => {
        return formData['warriors'].reduce((total, warrior) => {
            return total + warrior.qty;
        }, 0);
    }

    const getWarbandRating = () => {
        let totalWarriorExp = 0;
        totalWarriorExp = formData.warriors.reduce((total, warrior) => {
            const warriorTemplate = warriorTemplates.find(
                warriorTemplate => warriorTemplate.type === warrior.warriorTemplateType
            )
            return total + ((warrior.exp + warriorTemplate.startExp) * warrior.qty);
        }, 0);
        return getMemberCount() * 5 + totalWarriorExp;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const filterWarriorTemplates = (type) => {
        setFilteredWarriorTemplates([
            ...warriorTemplates.filter(warriorTemplate => warriorTemplate.warbandType === type)
        ]);
    }

    const handleChangeType = (e) => {
        filterWarriorTemplates(e.target.value)
        handleChange(e);
    }

    const handleChangeWarrior = (index, key, value) => {
        formData['warriors'][index][key] = value;
        setFormData({...formData})
    }

    const handleSubmit = () => {
        const json = JSON.stringify(formData);
        const base64 = btoa(json)

        console.log({
            length: base64.length,
            base64: base64,
            json: json,
            formData: formData
        })

        window.history.replaceState('', '', window.location.origin + window.location.pathname + '?c=' + base64)

        // localStorage.setItem('warband', json)
        // setWarbandJson(json)
        // setFeedback('Warband saved into localstorage')
    }

    const handleWarriorTemplateChoose = (warriorTemplateType) => {
        if (!warriorTemplateType) return;
        const warriorTemplate = warriorTemplates.find(warriorTemplate => warriorTemplate.type === warriorTemplateType);

        formData['warriors'] = [...formData['warriors'], {
            warriorTemplateType: warriorTemplate.type,
            equipments: [],
            rules: [],
            name: '',
            qty: 1,
            exp: 0,
            stats: {}
        }];
        setFormData({...formData})
    }

    const handleQtyChoose = (warriorIndex, qty) => {
        qty = parseInt(qty);
        formData['warriors'][warriorIndex]['qty'] = qty;
        setFormData({...formData})
    }

    const handleEquipmentChoose = (warriorIndex, equipmentName) => {
        if (!equipmentName) return;
        const alreadyAssigned = formData['warriors'][warriorIndex]['equipments'].find(
            warriorEquipmentName => warriorEquipmentName === equipmentName
        );
        if (alreadyAssigned) return;
        formData['warriors'][warriorIndex]['equipments'] = [
            ...formData['warriors'][warriorIndex]['equipments'],
            equipmentName
        ];
        setFormData({...formData})
    }

    const handleEquipmentRemove = (warriorIndex, warriorEquipmentIndex) => {
        formData['warriors'][warriorIndex]['equipments'].splice(warriorEquipmentIndex, 1);
        setFormData({...formData});
    }

    const handleWarriorRemove = (index) => {
        formData['warriors'].splice(index, 1);
        setFormData({...formData});
    }

    return (
        <div className="w-960 p-8">
            <div>{feedback}</div>
            <div className="md:flex gap-6 mb-4">
                <div className="border-2 flex flex-1 p-2 border-black">
                    <Name handleChange={handleChange} name={formData.name}/>
                </div>
                <div className="border-2 flex flex-2 p-2 border-black">
                    <Type handleChangeType={handleChangeType} warbandTypes={warbandTypes} type={formData.type}/>
                </div>
            </div>
            <div className="md:flex gap-6 mb-4">
                <div className="flex-none border-2 p-2 border-black">
                    <h2 className="uppercase text-center">Treasury:</h2>
                    <div className="border-b border-slate-300 mb-2 pb-2">
                        <p>Gold crowns: {calculateRemainingGold()}</p>
                        <input
                            className="rounded px-1 border border-slate-400 w-20 mr-1 print:hidden"
                            type="number"
                            value={inputData.gold}
                            onChange={(e) =>
                                setInputData({...inputData, gold: parseInt(e.target.value)})
                            }
                        />
                        <button
                            className="rounded border border-black px-1 m-1 print:hidden"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    gold: formData.gold + parseInt(inputData.gold)
                                })
                                setInputData({
                                    ...inputData,
                                    gold: 0
                                })
                            }}
                        >
                            Add
                        </button>
                        <button
                            className="rounded border border-black px-1 m-1 print:hidden"
                            onClick={() => {
                                setFormData({
                                    ...formData,
                                    gold: formData.gold - parseInt(inputData.gold)
                                })
                                setInputData({
                                    ...inputData,
                                    gold: 0
                                })
                            }}
                        >
                            Remove
                        </button>
                    </div>

                    <p>Wyrdstone shards: {formData.wyrdstone}</p>
                    <input
                        className="rounded px-1 border border-slate-400 w-20 mr-1 print:hidden"
                        type="number"
                        value={inputData.wyrdstone}
                        onChange={(e) =>
                            setInputData({...inputData, wyrdstone: parseInt(e.target.value)})
                        }
                    />
                    <button
                        className="rounded border border-black px-1 m-1 print:hidden"
                        onClick={() => {
                            setFormData({
                                ...formData,
                                wyrdstone: formData.wyrdstone + parseInt(inputData.wyrdstone)
                            })
                            setInputData({
                                ...inputData,
                                wyrdstone: 0
                            })
                        }}
                    >
                        Add
                    </button>
                    <button
                        className="rounded border border-black px-1 m-1 print:hidden"
                        onClick={sellWyrdstone}
                    >
                        Sell
                    </button>
                </div>
                <div className="flex-none border-2 p-2 border-black">
                    <h2 className="uppercase">Warband Rating:</h2>
                    <p>Total experience: {getTotalExperience()}</p>
                    <p className="border-b border-slate-300 pb-2 mb-2">Members {getMemberCount()} &times; 5</p>
                    <p>Rating: {getWarbandRating()}</p>
                </div>
                <div className="flex-1 border-2 p-2 border-black">
                    <h2 className="uppercase">Stored Equipment:</h2>
                    <select
                        className="print:hidden max-w-16 p-1 border border-black rounded"
                        onChange={(e) => {
                            if (e.target.value === '') return;
                            setFormData({
                                ...formData,
                                equipments: [
                                    ...formData.equipments,
                                    equipments.find(equipment => equipment.name === e.target.value).name
                                ]
                            })
                        }}
                    >
                        <option value="">Add</option>
                        {equipments.map((equipment, index) => (
                            <option value={equipment.name} key={index}>{equipment.name}</option>
                        ))}
                    </select>
                    <div className="flex">

                    {formData.equipments.map((equipmentName, index) => (
                        <span key={index} className="rounded bg-gray-200 m-1 px-1 leading-none py-1 flex">
                            <span className="flex-grow align-middle">{equipmentName}</span>
                            <span className="print:hidden font-bold cursor-pointer text-xl leading-none ml-1 flex-shrink text-rose-700"
                                    onClick={() => {
                                        formData.equipments.splice(index, 1);
                                        setFormData({...formData});
                                    }}
                            >&times;</span>
                        </span>
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
                    {filteredWarriorTemplates.map((warriorTemplate, index) => (
                        <option value={warriorTemplate.type} key={index}>
                            {warriorTemplate.type} - {warriorTemplate.isHero ? 'Hero' : 'Henchman'}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                {formData['warriors'].map((warrior, warriorIndex) => (
                    <Warrior
                        warrior={warrior}
                        warriorIndex={warriorIndex}
                        key={warriorIndex}
                        warriorTemplates={warriorTemplates}
                        warriorTypes={warriorTypes}
                        equipments={equipments}
                        handleChangeWarrior={handleChangeWarrior}
                        handleQtyChoose={handleQtyChoose}
                        handleEquipmentChoose={handleEquipmentChoose}
                        handleEquipmentRemove={handleEquipmentRemove}
                        handleWarriorRemove={handleWarriorRemove}
                        rules={rules}
                        getWarriorRuleNames={getWarriorRuleNames}
                    />
                ))}
            </div>
            <div>
                <h3 className="text-center text-lg mb-3">Equipment</h3>
                {getUniqueEquipment().map((equipment, index) => {
                    return (
                        <p key={index} className="my-1">
                            <span className="rounded bg-gray-200 m-1 px-1">{equipment.name}</span> {equipment.description}
                        {equipment.rules.map((ruleName, index) => (
                            <span key={index} className="rounded bg-gray-200 m-1 px-1">{ruleName}</span>
                        ))}
                        </p>
                    )
                })}
            </div>
            <div>
                <h3 className="text-center text-lg mb-3 mt-4">Rules</h3>
                {getUniqueRules().map((rule, index) => {
                    return (
                        <p className="my-1" key={index}><span className="rounded bg-gray-200 m-1 px-1">{rule.name}</span> {rule.description}</p>
                    )
                })}
            </div>
        </div>
    )
}