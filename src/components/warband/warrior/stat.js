import React from 'react';

const statsTemplate = {
    'movement': 'M',
    'weaponSkill': 'WS',
    'ballisticSkill': 'BS',
    'strength': 'S',
    'toughness': 'T',
    'wounds': 'W',
    'initiative': 'I',
    'attacks': 'A',
    'leadership': 'Ld',
}

export default function Stat({
    warriorTemplateStatKey,
    warriorTemplateStatValue,
    warrior,
    warriorIndex,
    handleChangeWarrior,
}) {
    const warriorStat = warriorTemplateStatKey in warrior.stats ? warrior.stats[warriorTemplateStatKey] : 0;

    return (
        <div className="flex-1 text-center">
            <div>{statsTemplate[warriorTemplateStatKey]}</div>
            <input
                style={{width: '30px'}}
                type="number"
                value={warriorStat + warriorTemplateStatValue}
                onChange={function (e) {
                    handleChangeWarrior(warriorIndex, 'stats', {
                        ...warrior.stats,
                        [warriorTemplateStatKey]: e.target.value - warriorTemplateStatValue
                    })
                }}
            />
        </div>
    )
}