import axios from "axios";
import {useState, useEffect} from "react";
import WarbandName from "@/Pages/Warband/Persist/WarbandName.jsx";

export default function Create({
    warband,
    types,
    warriorTemplates,
    equipments
}) {
    const [feedback, setFeedback] = useState()
    const [formData, setFormData] = useState(warband ? warband : {});
    const [filteredWarriorTemplates, setFilteredWarriorTemplates] = useState(warriorTemplates);
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

    useEffect(() => {
        handleChangeType({target: {
            name: 'type',
            value: warband.type
        }})
    }, ['']);

    const getMemberCount = () => {
        return formData['warriors'].length;
    }

    const getWarbandRating = () => {
        return getMemberCount() * 5;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeType = (e) => {
        setFilteredWarriorTemplates([
            ...warriorTemplates.filter(warriorTemplate => warriorTemplate.warband_type === e.target.value)
        ]);
        handleChange(e);
    }

    const handleChangeWarrior = (index, key, value) => {
        formData['warriors'][index][key] = value;
        setFormData({...formData})
    }

    const handleSubmit = () => {
        axios.post('/warband', {
            ...formData,
        })
        .then(response => {
            formData['id'] = response.data.id
            setFormData(formData);
        }).catch(error => {
            setFeedback(error.response.data.message);
        })
    }

    const handleWarriorTemplateChoose = (warriorTemplateId) => {
        warriorTemplateId = parseInt(warriorTemplateId);
        if (!warriorTemplateId) return;
        const warriorTemplate = warriorTemplates.find(warriorTemplate => warriorTemplate.id === warriorTemplateId);
        formData['warriors'] = [...formData['warriors'], {
            warrior_template_id: warriorTemplate.id,
            equipments: []
        }];
        setFormData({...formData})
    }

    const handleQtyChoose = (warriorIndex, qty) => {
        qty = parseInt(qty);
        formData['warriors'][warriorIndex]['qty'] = qty;
        setFormData({...formData})
    }

    const handleEquipmentChoose = (warriorIndex, equipmentId) => {
        equipmentId = parseInt(equipmentId);
        if (!equipmentId) return;
        const alreadyAssigned = formData['warriors'][warriorIndex]['equipments'].find(warriorEquipment => warriorEquipment.id === equipmentId);
        if (alreadyAssigned) return;
        formData['warriors'][warriorIndex]['equipments'] = [
            ...formData['warriors'][warriorIndex]['equipments'],
            equipments.find(equipment => equipment.id === equipmentId)
        ];
        setFormData({...formData})
    }

    const handleEquipmentRemove = (warriorIndex, warriorEquipmentIndex) => {
        formData['warriors'][warriorIndex]['equipments'].splice(warriorEquipmentIndex, 1);
        setFormData({...formData});
    }

    const handleWarriorRemove = ({ index }) => {
        formData['warriors'].splice(index, 1);
        setFormData({...formData});
    }

    return (
        <>
            <h1 className="print:hidden">Warband Maker</h1>
            <div>{feedback}</div>
            <div className="flex gap-6 mb-4">
                <div className="border-2 flex flex-1 p-2 border-black">
                    <WarbandName onChange={handleChange} value={warband.name} />
                </div>
                <div className="border-2 flex flex-2 p-2 border-black">
                    <h2 className="uppercase mr-2">Warband Type:</h2>
                    <select className="print:hidden" name="type" onChange={handleChangeType}
                            defaultValue={warband.type}>
                        <option value="">Select Type</option>
                        {types.map((type, index) => (
                            <option value={type} key={index}>{type}</option>
                        ))}
                    </select>
                    <span className="screen:hidden print:show">{warband.type}</span>
                </div>
            </div>
            <div className="flex gap-6 mb-4">
                <div className="flex-none border-2 p-2 border-black">
                    <h2 className="uppercase text-center">Treasury:</h2>
                    <p>Gold crowns: x</p>
                    <p>Wyrdstone shards: x</p>
                </div>
                <div className="flex-none border-2 p-2 border-black">
                    <h2 className="uppercase">Warband Rating:</h2>
                    <p>Total experience: x</p>
                    <p>Members {getMemberCount()} &times; 5</p>
                    <p>Rating: {getWarbandRating()}</p>
                </div>
                <div className="flex-1 border-2 p-2 border-black">
                    <h2 className="uppercase">Stored Equipment:</h2>
                    <p>Equipment that you have but not assigned to any warrior yet.</p>
                </div>
            </div>
            <div className="mb-4 print:hidden">
                <h2>Warrior Types</h2>
                <select
                    onChange={(e) => handleWarriorTemplateChoose(e.target.value)}
                >
                    <option value="">Add Warrior</option>
                    {filteredWarriorTemplates.map((warriorTemplate, index) => (
                        <option value={warriorTemplate.id} key={index}>
                            {warriorTemplate.type} - {warriorTemplate.is_hero ? 'Hero' : 'Henchman'}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                {formData['warriors'].map((warrior, warriorIndex) => {
                    const warriorTemplate = warriorTemplates.find(warriorTemplate => warriorTemplate.id === warrior.warrior_template_id);

                    return (
                        <div key={warriorIndex} className="border-2 border-black flex">
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
                                        <select className="print:hidden" name="qty" onChange={(e) => handleQtyChoose(warriorIndex, e.target.value)}>
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
                })}
                <div>
                    <button className="border-2 px-3 py-2" onClick={handleSubmit}>Save</button>
                </div>
            </div>
        </>
    )
}
