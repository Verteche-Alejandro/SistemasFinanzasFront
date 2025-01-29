import Esquema from "../Layouts/Esquema"
import ReporteTransac from "../Layouts/ReporteTransac";

const Reportes = () => {
    const cuenta_id = 3;
    return (
        <>
            <Esquema>
                <ReporteTransac cuenta_id={cuenta_id} />
            </Esquema>
        </>
    )
}
export default Reportes