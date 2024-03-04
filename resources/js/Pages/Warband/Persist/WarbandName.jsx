export default function WarbandName({ handleChange, name}) {
    return (
        <>
            <h2 className="uppercase mr-2">Warband Name:</h2>
            <input className="print:hidden" name="name" type="text" onChange={handleChange} value={name}/>
            <span className="screen:hidden print:show">{name}</span>
        </>
    )
}
