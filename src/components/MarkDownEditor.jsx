/* eslint-disable react/prop-types */
// 878
import { Editor } from '@tinymce/tinymce-react';
import { memo, useEffect, useState } from 'react';

function MarkDownEditor({label,value='',changeValue,name,height,invalidField,setInvalidField,iconRequire, classParent}) {
  const error = invalidField?.find((item) => item.name === name);
  const [localValue, setLocalValue] = useState(value);
  useEffect(() => {
    setLocalValue(value)
  }, [value]);
  return (
    <div className={classParent}>
      <span className='inline-block my-2'>{iconRequire &&<span className='text-red-500'>*</span>}{label}</span>
      <Editor
        apiKey={import.meta.env.VITE_API_KEY_TINY}
        value={localValue}
        init={{
          height,
          menubar: true,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onChange = {(e)=>{
          changeValue((prev) => ({...prev,[name]:e.target.getContent()}))
        }}
        onEditorChange={(e)=>{
          setLocalValue(e)
        }}
        onFocusOut = {()=> setInvalidField && setInvalidField([])}
      />
      {error && <span className="text-red-500">{error.mes}</span>}
    </div>
  );
}
export default memo(MarkDownEditor);