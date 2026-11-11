import { useMemo } from 'react'
import CatalogManager from '../../components/EntityManager/CatalogManager.jsx'
import { actualizarTipoPredio, eliminarTipoPredio, listarTiposPredio, registrarTipoPredio } from '../../services/tipoPredioService.js'
function TiposPredioPage(){const service=useMemo(()=>({list:listarTiposPredio,create:registrarTipoPredio,update:actualizarTipoPredio,remove:eliminarTipoPredio}),[]);return <CatalogManager title="Tipos de predio" description="Configura las categorías utilizadas para clasificar predios y tarifas." singular="Tipo de predio" service={service}/>}
export default TiposPredioPage
