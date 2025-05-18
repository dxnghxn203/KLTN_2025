"use client";

import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

// Dynamic import với ssr: false và kiểu any
const ReactQuill = dynamic(
    () => import('react-quill'),
    {
        ssr: false,
        loading: () => <div className="border rounded-lg p-2 w-full h-32 bg-gray-50">Đang tải editor...</div>
    }
) as any;

export const toolbarOptions = [
    [{header: [1, 2, 3, 4, false]}],
    [{font: []}],
    [{size: []}],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{list: "ordered"}, {list: "bullet"}, {indent: "-1"}, {indent: "+1"}],
    ["link", "image", "video"],
    ["clean"], // remove formatting button
];

interface DynamicQuillProps {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

export default function DynamicReactQuill({value, onChange, readOnly = false}: DynamicQuillProps) {
    return (
        <ReactQuill
            value={value}
            onChange={onChange}
            modules={{toolbar: toolbarOptions}}
            readOnly={readOnly}
            theme="snow"
        />
    );
}