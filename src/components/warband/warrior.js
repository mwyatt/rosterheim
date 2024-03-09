import React from 'react';
import Stat from './warrior/stat';
import warriorTemplates from "../../data/warriorTemplates.json";
import rules from "../../data/rules.json";

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
    rules,
    getWarriorRuleNames
}) {
    const warriorTemplate = warriorTemplates.find(
        warriorTemplate => warriorTemplate.type === warrior.warriorTemplateType
    );
    const warriorType = warriorTypes.find(
        warriorType => warriorType.isHero === warriorTemplate.isHero
    );

    const getRules = () => {
        const ruleNames = getWarriorRuleNames(warrior);
        return rules.filter(rule => ruleNames.includes(rule.name));
    }

    const getExpTable = () => {
        let output = [];
        for (let i = 1; i < (warriorType.expAvailable + 1); i++) {
            const filled = (warrior.exp + warriorTemplate.startExp) >= i;
            const advance = warriorType.expAdvances.find(
                expAdvance => expAdvance === i
            );
            const classNames = [
                filled ? 'bg-gray-300' : '',
                'border',
                'p-2',
                'm-0.5 my-0',
                'w-2',
                advance ? 'border-2 border-black' : ''
            ]
            output.push(
                <span key={i} className={classNames.join(' ')} style={{
                    "display": "inline-block"
                }}>

                </span>
            )
        }
        return output;
    }

    return (
        <div className="border-2 border-black flex mb-2">
            <div className="border-r-2 border-black">
                <div className="border-b-2 border-black flex p-1">
                    <span className="uppercase mr-2">Name</span>
                    <input
                        required={true}
                        className="print:hidden px-1 py-0 border-none"
                        type="text"
                        onChange={function (e) {
                            handleChangeWarrior(warriorIndex, 'name', e.target.value)
                        }}
                        value={warrior.name}
                    />
                    <span className="screen:hidden print:show">{warrior.name}</span>
                </div>
                <div className="flex border-b-2 border-black">
                    <div className="border-r-2 border-black p-1">
                        <span className="uppercase pr-2">Number</span>
                        <span
                            className={[
                                warriorTemplate.isHero ? '' : 'screen:hidden'
                            ].join(' ')}
                        >{warrior.qty}</span>
                        <select
                            defaultValue={warrior.qty}
                            className={[
                                'print:hidden',
                                warriorTemplate.isHero ? 'hidden' : ''
                            ].join(' ')}
                            name="qty"
                            onChange={(e) => handleQtyChoose(warriorIndex, e.target.value)}
                        >
                            {Array.from(Array(3).keys()).map((number, index) => (
                                <option value={number + 1} key={index}>{number + 1}</option>))}
                        </select>
                    </div>
                    <div className="p-1">
                        <span className="uppercase pr-2">Type</span> {warriorTemplate.type}
                    </div>
                </div>
                <div className="flex">
                    {Object.keys(warriorTemplate.stats).map(
                        (warriorTemplateStatKey, index) =>
                            <Stat
                                key={index}
                                warriorTemplateStatKey={warriorTemplateStatKey}
                                warriorTemplateStatValue={warriorTemplate.stats[warriorTemplateStatKey]}
                                warrior={warrior}
                                warriorIndex={warriorIndex}
                                handleChangeWarrior={handleChangeWarrior}
                            />)
                    }
                </div>
                <div className="print:hidden">
                    <select
                        onChange={function (e) {
                            if (e.target.value === '') return;
                            handleChangeWarrior(warriorIndex, 'injuries', [...new Set([
                                ...warrior.injuries,
                                e.target.value
                            ])])
                        }}
                    >
                        <option value="">Serious Injury</option>

                        {rules.map((rule, index) => {
                            if (rule.type === 'seriousInjury') {
                                return <option value={rule.name} key={index}>{rule.name}</option>
                            }
                        })}
                    </select>

                    {warrior.injuries.map((injury, index) => (
                        <div key={index}>
                            <span className="rounded-sm bg-gray-200 m-1 px-1">{injury}</span>
                            <button className="print:hidden"
                                    onClick={function (e) {
                                        handleChangeWarrior(warriorIndex, 'injuries', [
                                            ...warrior.injuries.filter(warriorInjury => warriorInjury !== injury),
                                        ])
                                    }}
                            >&times;</button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <div className="flex">
                    <div className="border-r-2 border-b-2 border-black p-2">
                    <h2 className="uppercase">Equipment</h2>
                    <select
                        className="print:hidden"
                        onChange={(e) => handleEquipmentChoose(warriorIndex, e.target.value)}
                    >
                        <option value="">Add</option>
                        {equipments.map((equipment, index) => (
                                <option value={equipment.name} key={index}>{equipment.name}</option>))}
                        </select>
                        {warrior.equipments.map((warriorEquipment, warriorEquipmentIndex) => (
                            <div key={warriorEquipmentIndex}>
                                <span className="rounded-sm bg-gray-200 m-1 px-1">{warriorEquipment.name}</span>
                                <button className="print:hidden"
                                      onClick={() => handleEquipmentRemove(warriorIndex, warriorEquipmentIndex)}>&times;</button>
                            </div>
                        ))}
                    </div>
                    <div className="border-b-2 border-black p-2">
                        <h2 className="uppercase">Special Rules</h2>
                        {getRules().map((rule, index) => (
                            <span className="rounded-sm bg-gray-200 m-1 px-1" key={index}>{rule.name}</span>
                        ))}
                    </div>
                </div>
                <div>
                    <input
                        type="number"
                        value={warriorTemplate.startExp + warrior.exp}
                        onChange={function (e) {
                            handleChangeWarrior(warriorIndex, 'exp', e.target.value - warriorTemplate.startExp)
                        }}
                    />
                    {getExpTable()}
                </div>
            </div>
            <button onClick={() => handleWarriorRemove(warriorIndex)}>&times;</button>
        </div>)
}