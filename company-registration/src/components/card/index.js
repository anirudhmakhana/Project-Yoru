import "../../assets/style/card.css"

export const Card = (props) => {
    return(
        <div className="card">
            <div className="card-body">
                <h2>{props.title}</h2>
                <p>{props.info}</p>
            </div>
        </div>
    );
}