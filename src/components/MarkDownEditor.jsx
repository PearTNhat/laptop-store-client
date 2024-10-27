/* eslint-disable react/prop-types */
//import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function MarkDownEditor({label,value='',changeValue,name,invalidField,setInvalidField}) {
  const error = invalidField?.find((item) => item.name === name);
  return (
    <div>
      <span>{label}</span>
      <Editor
        apiKey='j9p5nmemoud9rzhrgc1gjydlx1t1x0t14wsstn6ccmb3cmya'
        initialValue={value}
        init={{
          height: 500,
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
          changeValue( (prev) => ({...prev,[name]:e.target.getContent()}))
        }}
        onFocusOut = {()=> setInvalidField && setInvalidField([])}
      />
      {error && <span className="text-red-500">{error.mes}</span>}
    </div>
  );
}