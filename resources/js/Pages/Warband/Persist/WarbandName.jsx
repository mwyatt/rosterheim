export default function WarbandName(props) {
    return (
        <>
            <h2 className="uppercase mr-2">Warband Name:</h2>
            <input className="print:hidden" name="name" type="text" {...props}/>
            <span className="screen:hidden print:show">{props.value}</span>
        </>
    )
}
