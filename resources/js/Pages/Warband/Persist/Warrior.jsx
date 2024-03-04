export default function Warrior({
    warrior,
    warriorIndex,
    warriorTemplates,
    equipments,
    handleChangeWarrior,
    handleQtyChoose,
    handleEquipmentChoose,
    handleEquipmentRemove,
    handleWarriorRemove
}) {
    const statsTemplate = {
        'M': 'stat_movement',
        'WS': 'stat_weapon_skill',
        'BS': 'stat_ballistic_skill',
        'S': 'stat_strength',
        'T': 'stat_toughness',
        'W': 'stat_wounds',
        'I': 'stat_initiative',
        'A': 'stat_attacks',
        'Ld': 'stat_leadership',
    }
    const warriorTemplate = warriorTemplates.find(warriorTemplate => warriorTemplate.id === warrior.warrior_template_id);

    return (
        <div className="border-2 border-black flex">
            <div>
                <div className="border-b-2 border-black">
                    <label htmlFor="" className="mr-2">Name</label>
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
                                <option value={number + 1} key={index}>{number + 1}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        Type {warriorTemplate.type}
                    </div>
                </div>
                <div className="flex">
                    {Object.keys(statsTemplate).map((key, index) => (
                        <div className="flex-1 text-center" key={index}>
                            <div>{key}</div>
                            <span>{warriorTemplate[statsTemplate[key]]}</span>
                        </div>
                    ))}
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
                                <option value={equipment.id} key={index}>{equipment.name}</option>
                            ))}
                        </select>
                        {warrior.equipments.map((warriorEquipment, warriorEquipmentIndex) => (
                            <div key={warriorEquipmentIndex}>
                                <div>{equipments.find(equipment => equipment.id === warriorEquipment.id).name}</div>
                                <span className="print:hidden"
                                      onClick={() => handleEquipmentRemove(warriorIndex, warriorEquipmentIndex)}>&times;</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h2 className="uppercase">Special Rules</h2>
                        {warriorTemplate.rules.map((rule, index) => (
                            <span className="rounded-sm bg-gray-300 m-1 p-1" key={index}>{rule.name}</span>
                        ))}
                    </div>
                </div>
                <div>
                    Experience - boxes for each experience point available

                </div>
            </div>
            <button onClick={() => handleWarriorRemove(warriorIndex)}>&times;</button>
        </div>
    )
}
