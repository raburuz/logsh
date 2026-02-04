import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

export const Refresh = () => {

  //const { refresh } = useEvents();

  return (
    <Button variant="ghost" size="sm">
      <RefreshCw/>
    </Button>
  )
}
