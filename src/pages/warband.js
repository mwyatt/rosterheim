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
    const [warbandJson, setWarbandJson] = useState()
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        warriors: []
    });

    console.log(formData);

    const [filteredWarriorTemplates, setFilteredWarriorTemplates] = useState([]);

    useEffect(() => {
        const json = localStorage.getItem('warband');
        if (json) {
            const data = JSON.parse(json);
            setFormData(data);
            filterWarriorTemplates(data.type)
        }
    }, []);

    const calculateRemainingGold = () => {
        const totalGold = formData['warriors'].reduce((total, warrior) => {
            const warriorTemplate = warriorTemplates.find(
                warriorTemplate => warriorTemplate.type === warrior['warriorTemplateType']
            )
            const warriorEquipmentCost = warrior['equipments'].reduce((total, equipment) => {
                return total + equipment.gold;
            }, 0);
            return total + warrior['qty'] * (warriorTemplate.gold + warriorEquipmentCost);
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
        console.log('saving formData', formData);
        const json = JSON.stringify(formData);
        localStorage.setItem('warband', json)
        setWarbandJson(json)
        setFeedback('Warband saved into localstorage')
    }

    const handleWarriorTemplateChoose = (warriorTemplateType) => {
        if (!warriorTemplateType) return;
        const warriorTemplate = warriorTemplates.find(warriorTemplate => warriorTemplate.type === warriorTemplateType);

        formData['warriors'] = [...formData['warriors'], {
            warriorTemplateType: warriorTemplate.type,
            equipments: [],
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
            warriorEquipment => warriorEquipment.name === equipmentName
        );
        if (alreadyAssigned) return;
        formData['warriors'][warriorIndex]['equipments'] = [
            ...formData['warriors'][warriorIndex]['equipments'],
            equipments.find(equipment => equipment.name === equipmentName)
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
        <div className="w-960">
            <h1 className="print:hidden">Warband Maker</h1>
            <div>{feedback}</div>
            <div>{warbandJson}</div>
            <div className="flex gap-6 mb-4">
                <div className="border-2 flex flex-1 p-2 border-black">
                    <Name handleChange={handleChange} name={formData.name}/>
                </div>
                <div className="border-2 flex flex-2 p-2 border-black">
                    <Type handleChangeType={handleChangeType} warbandTypes={warbandTypes} type={formData.type}/>
                </div>
            </div>
            <div className="flex gap-6 mb-4">
                <div className="flex-none border-2 p-2 border-black">
                    <h2 className="uppercase text-center">Treasury:</h2>
                    <p>Gold crowns: {calculateRemainingGold()}</p>
                    <p>Wyrdstone shards: 0</p>
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
                        <option value={warriorTemplate.type} key={index}>
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
                        warriorTypes={warriorTypes}
                        equipments={equipments}
                        rules={rules}
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
        </div>
    )
}