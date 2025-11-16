import { useDark } from "rspress/runtime";

export default function ArchitectureDiagram() {
    const dark = useDark();
    return <iframe src={`https://link.excalidraw.com/readonly/WPfZVHs9GgNZfEfejzN0?darkMode=${dark}`} width="100%" height="500px" />;
  
  }

