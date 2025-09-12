import useAbility, { CRUDAction, Subject } from "@/hooks/useAbility"
import { Can } from "@casl/react"
import { FC, ReactElement } from "react"

type TAbility = FC<{
  action: CRUDAction
  subject: Subject
  children: ReactElement
}>

const Ability: TAbility = ({ action, subject, children }) => {
  const ability = useAbility()

  if (ability)
    return (
      <Can I={action} a={subject} ability={ability}>
        {children}
      </Can>
    )
  return children
}

export default Ability
