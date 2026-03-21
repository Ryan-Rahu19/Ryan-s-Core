import Editor from "@monaco-editor/react"

export default function CodeEditor({code,setCode,language}){

return(

<Editor
height="400px"
theme="vs-dark"
language={language}
value={code}
onChange={(value)=>setCode(value)}
/>

)

}