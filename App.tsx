import { NativeBaseProvider, StatusBar } from "native-base"
import { Home } from "./src/Home"

export default function App() {
  return (
    <NativeBaseProvider>
      <StatusBar barStyle="light-content" />
      <Home />
    </NativeBaseProvider>
  )
}
