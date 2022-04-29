import "../../assets/style/card.css"

export const Card = (props) => {
    return(
        <div className="card">
            <div className="card-body">
                <h2 className="card-title">{props.title}</h2>
                <p className="card-info">{props.info}</p>
            </div>
        </div>
    );
}