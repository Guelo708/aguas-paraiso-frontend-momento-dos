import { useMemo } from 'react'
import CatalogManager from '../../components/EntityManager/CatalogManager.jsx'
import { actualizarSector, eliminarSector, listarSectores, registrarSector } from '../../services/sectorService.js'
function SectoresPage(){const service=useMemo(()=>({list:listarSectores,create:registrarSector,update:actualizarSector,remove:eliminarSector}),[]);return <CatalogManager title="Sectores" description="Administra las zonas de distribución del servicio." singular="Sector" service={service}/>}
export default SectoresPage
