import { useRouter } from 'next/router'
import ModuleLayout from '../../components/ModuleLayout'
export default function Processus() {
  const router=useRouter()
  const cards=[
    ['IMPORT',"Dédouanement à l'importation","Flux complet de la commande à l'enlèvement, documents requis, délais BADR."],
    ['EXPORT','Exportation définitive','Déclaration d\'exportation, visa douanier, rapatriement de devises.'],
    ['TRANSIT','Transit national et international','Carnets TIR, transit TIRCAM, transit sous douane marocaine.'],
    ['AÉRIEN','Fret aérien — ONDA/RAM Cargo','LTA, AWB, procédures CASA/CMN/RAK pour fret aérien international.'],
    ['MARITIME','Fret maritime — ports marocains','TANGER MED, CASABLANCA, AGADIR — procédures portuaires et PORTNET.'],
    ['ROUTIER','Transport routier international','CMR, TIR, passages frontières terrestres (Bab Sebta, Guerguerat).'],
  ]
  return(
    <ModuleLayout kicker="MODULE 03" title="Processus Douaniers" sub="Flux détaillés des opérations d'importation, d'exportation et de transit avec les documents requis à chaque étape.">
      <div className="card-grid">
        {cards.map(([num,title,desc])=>(
          <div key={num} className="card"><div className="card-num">{num}</div><div className="card-title">{title}</div><div className="card-desc">{desc}</div><div className="card-arrow">→ Voir le processus</div></div>
        ))}
      </div>
    </ModuleLayout>
  )
}
