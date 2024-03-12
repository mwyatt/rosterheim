import React from 'react';
import Stat from './warrior/stat';
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
                filled ? 'bg-slate-300' : '',
                'border',
                'p-2',
                'm-0.5 my-0',
                'w-2',
                advance ? 'border-slate-500' : 'border-slate-300'
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
        <div className="mb-3 break-inside-avoid">
            <div className="text-right print:hidden">
                <button className="text-rose-700 text-3xl" onClick={() => handleWarriorRemove(warriorIndex)}>&times;</button>
            </div>
            <div className="border border-black sm:flex">
                <div className="border-r border-black">
                    <div className="border-b border-black flex p-1">
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
                    <div className="flex border-b border-black">
                        <div className="border-r border-black p-1 pr-2">
                            <span className="uppercase pr-2">Number</span>
                            <span
                                className={[
                                    warriorTemplate.isHero ? '' : 'screen:hidden',
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
                    <div className="flex p-1 gap-2 print:hidden">
                        <div className="flex-1">
                            <select
                                className="print:hidden p-1 border border-black rounded w-full"
                                onChange={function (e) {
                                    if (e.target.value === '') return;
                                    handleChangeWarrior(warriorIndex, 'rules', [...new Set([
                                        ...warrior.rules,
                                        e.target.value
                                    ])])

                                }}
                            >
                                <option value="">Add Injury</option>

                                {rules.map((rule, index) => {
                                    if (rule.type === 'injury') {
                                        return <option value={rule.name} key={index}>{rule.name}</option>
                                    }
                                    return null;
                                })}
                            </select>
                        </div>
                        <div className="flex-1">
                            <select
                                className="print:hidden p-1 border border-black rounded w-full"
                                onChange={function (e) {
                                    if (e.target.value === '') return;
                                    handleChangeWarrior(warriorIndex, 'rules', [...new Set([
                                        ...warrior.rules,
                                        e.target.value
                                    ])])
                                }}
                            >
                                <option value="">Add Skill</option>

                                {rules.map((rule, index) => {
                                    if (
                                        rule.type === 'skill'
                                        && (rule.warbandType === warriorTemplate.warbandType || rule.warbandType === '')
                                    ) {
                                        return <option value={rule.name} key={index}>{rule.name}</option>
                                    }
                                    return null;
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-1 m-1">
                        {warrior.rules.map((injury, index) => (
                            <ClosePill
                                key={index}
                                name={injury}
                                handleClick={() => {
                                    handleChangeWarrior(warriorIndex, 'rules', [
                                        ...warrior.rules.filter(warriorInjury => warriorInjury !== injury),
                                    ])
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
                            onChange={(e) => handleEquipmentChoose(warriorIndex, e.target.value)}
                        >
                            <option value="">Add</option>
                            {equipments.map((equipment, index) => (
                                <option value={equipment.name} key={index}>{equipment.name}</option>
                            ))}
                        </select>
                        <div className="flex flex-wrap gap-1 mt-1">
                        {warrior.equipments.map((warriorEquipmentName, warriorEquipmentIndex) => (
                            <ClosePill
                                key={warriorEquipmentIndex}
                                name={warriorEquipmentName}
                                handleClick={() => handleEquipmentRemove(warriorIndex, warriorEquipmentIndex)}
                            />
                        ))}
                        </div>
                    </div>
                    <div className="p-2 flex-grow">
                        <h3 className="uppercase mb-2">Special Rules</h3>
                        <div className="flex flex-wrap gap-1">
                        {getRules().map((rule, index) => (
                            <ClosePill name={rule.name} key={index} />
                        ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-l border-r border-b border-black p-2">
                <div className="flex mb-2 w-20 h-6 print:hidden">
                    <span
                        className="text-xl border border-black leading-none flex-1 text-center rounded"
                        onClick={function (e) {
                            handleChangeWarrior(warriorIndex, 'exp', warrior.exp - 1)
                        }}
                    >-</span>
                    <span className="flex-1 text-center">{warriorTemplate.startExp + warrior.exp}</span>
                    <span
                        className="text-xl border border-black flex-1 leading-none text-center rounded"
                        onClick={function (e) {
                            handleChangeWarrior(warriorIndex, 'exp', warrior.exp + 1)
                        }}
                    >+</span>
                </div>
                <div>
                    {getExpTable()}
                </div>
            </div>
        </div>
    )
}