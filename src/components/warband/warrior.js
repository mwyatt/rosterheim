import React from 'react';
import Stat from './warrior/stat';

export default function Warrior({
    warrior,
    warriorIndex,
    warriorTemplates,
    warriorTypes,
    equipments,
    rules,
    handleChangeWarrior,
    handleQtyChoose,
    handleEquipmentChoose,
    handleEquipmentRemove,
    handleWarriorRemove,
}) {
    const warriorTemplate = warriorTemplates.find(
        warriorTemplate => warriorTemplate.type === warrior.warriorTemplateType
    );
    const warriorType = warriorTypes.find(
        warriorType => warriorType.isHero === warriorTemplate.isHero
    );

    const getCombinedRules = () => {
        console.log({
            warriorTemplate: warriorTemplate,
            warrior: warrior,
        })
        let ruleNames = warriorTemplate.rules;
        warrior.equipments.forEach(equipment => {
            ruleNames = ruleNames.concat(equipment.rules);
        });
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
                'm-1',
                advance ? 'border-2 border-black' : ''
            ]
            output.push(
                <span key={i} className={classNames.join(' ')} style={{
                    "width": "10px",
                    "height": "10px",
                    "display": "inline-block"
                }}>

                </span>
            )
        }
        return output;
    }

    return (
        <div className="border-2 border-black flex">
            <div>
                <div className="border-b-2 border-black">
                    <h2 className="mr-2">Name</h2>
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
                <div className="flex">
                    <div className="border-r-2 border-black">
                        Number <span className="screen:hidden">{warrior.qty}</span>
                        <select
                            defaultValue={warrior.qty}
                            className="print:hidden"
                            name="qty"
                            onChange={(e) => handleQtyChoose(warriorIndex, e.target.value)}
                        >
                            {Array.from(Array(3).keys()).map((number, index) => (
                                <option value={number + 1} key={index}>{number + 1}</option>))}
                        </select>
                    </div>
                    <div>
                        Type {warriorTemplate.type}
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
            </div>
        <div>
            <div className="flex">
                <div>
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
                                <div>{warriorEquipment.name}</div>
                                <button className="print:hidden"
                                      onClick={() => handleEquipmentRemove(warriorIndex, warriorEquipmentIndex)}>&times;</button>
                            </div>))}
                    </div>
                    <div>
                        <h2 className="uppercase">Special Rules</h2>
                        {warriorTemplate.rules.map((ruleName, index) => (
                            <span className="rounded-sm bg-gray-300 m-1 p-1" key={index}>{ruleName}</span>))}
                    </div>
                </div>
                <div>
                    Experience

                    <input
                        type="number"
                        value={warriorTemplate.startExp + warrior.exp}
                        onChange={function (e) {
                            handleChangeWarrior(warriorIndex, 'exp', e.target.value - warriorTemplate.startExp)
                        }}
                    />

                    {getExpTable()}

                </div>
                <div>
                    <h3>Rules</h3>

                    {getCombinedRules().map((rule, index) => {
                        return (
                            <div key={index}>
                                <h4>{rule.name}</h4>
                                <p>{rule.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
            <button onClick={() => handleWarriorRemove(warriorIndex)}>&times;</button>
        </div>)
}