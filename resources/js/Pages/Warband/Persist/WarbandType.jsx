export default function WarbandType({ handleChangeType, type, warbandTypes }) {
    return (
        <>
            <h2 className="uppercase mr-2">Warband Type:</h2>
            <select className="print:hidden" name="type" onChange={handleChangeType} defaultValue={type}>
                <option value="">Select Type</option>
                {warbandTypes.map((warbandType, index) => (
                    <option value={warbandType} key={index}>{warbandType}</option>
                ))}
            </select>
            <span className="screen:hidden print:show">{type}</span>
        </>
    )
}
