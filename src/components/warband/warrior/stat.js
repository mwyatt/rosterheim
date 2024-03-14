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

    const isBoosted = warrior.stats[warriorTemplateStatKey] > 0;

    return (
        <div className="flex-1 text-center">
            <div>{statsTemplate[warriorTemplateStatKey]}</div>
            <input
                className={[
                    "w-10 text-center bg-transparent rounded",
                    isBoosted && "border border-black"
                ].join(' ')}
                title={isBoosted ? 'boosted by ' + (warrior.stats[warriorTemplateStatKey]) : ''}
                type="text"
                value={warriorStat + warriorTemplateStatValue}
                onChange={function (e) {
                    //
                }}
                onSelect={function (e) {
                    e.target.select();
                }}
                onKeyUp={function (e) {
                    const number = parseInt(e.key);
                    if (isNaN(number)) return;
                    handleChangeWarrior(warriorIndex, 'stats', {
                        ...warrior.stats,
                        [warriorTemplateStatKey]: parseInt(e.key) - warriorTemplateStatValue
                    })
                }}
            />
        </div>
    )
}