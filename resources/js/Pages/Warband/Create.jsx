import axios from "axios";
import {useState, useEffect} from "react";
import WarbandName from "@/Pages/Warband/Persist/WarbandName.jsx";
import WarbandType from "@/Pages/Warband/Persist/WarbandType.jsx";
import Warrior from "@/Pages/Warband/Persist/Warrior.jsx";

export default function Create({
    warband,
    warbandTypes,
    warriorTemplates,
    equipments
}) {
    const [feedback, setFeedback] = useState()
    const [formData, setFormData] = useState(warband ? warband : {});
    const [filteredWarriorTemplates, setFilteredWarriorTemplates] = useState(warriorTemplates);

    useEffect(() => {
        handleChangeType({target: {
            name: 'type',
            value: warband.type
        }})
    }, ['']);

    const calculateRemainingGold = () => {
        const totalGold = formData['warriors'].reduce((total, warrior) => {
            return total + warrior['qty'] * warriorTemplates.find(warriorTemplate => warriorTemplate.id === warrior['warrior_template_id']).cost;
        }, 0);
        return 500 - totalGold;
    }

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
            equipments: [],
            name: '',
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

    const handleWarriorRemove = (index) => {
        formData['warriors'].splice(index, 1);
        setFormData({...formData});
    }

    return (
        <>
            <h1 className="print:hidden">Warband Maker</h1>
            <div>{feedback}</div>
            <div className="flex gap-6 mb-4">
                <div className="border-2 flex flex-1 p-2 border-black">
                    <WarbandName handleChange={handleChange} name={formData.name}/>
                </div>
                <div className="border-2 flex flex-2 p-2 border-black">
                    <WarbandType handleChangeType={handleChangeType} warbandTypes={warbandTypes} type={formData.type}/>
                </div>
            </div>
            <div className="flex gap-6 mb-4">
                <div className="flex-none border-2 p-2 border-black">
                    <h2 className="uppercase text-center">Treasury:</h2>
                    <p>Gold crowns: {calculateRemainingGold()}</p>
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
                {formData['warriors'].map((warrior, warriorIndex) => (
                    <Warrior
                        warrior={warrior}
                        warriorIndex={warriorIndex}
                        key={warriorIndex}
                        warriorTemplates={warriorTemplates}
                        equipments={equipments}
                        handleChangeWarrior={handleChangeWarrior}
                        handleQtyChoose={handleQtyChoose}
                        handleEquipmentChoose={handleEquipmentChoose}
                        handleEquipmentRemove={handleEquipmentRemove}
                        handleWarriorRemove={handleWarriorRemove}
                    />
                ))}
            </div>
            <div>
                <button className="border-2 px-3 py-2" onClick={handleSubmit}>Save</button>
            </div>
        </>
    )
}
