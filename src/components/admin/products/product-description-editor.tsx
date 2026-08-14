"use client";

type ProductDescriptionEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ProductDescriptionEditor({ value, onChange }: ProductDescriptionEditorProps) {

  return (
    <div data-lenis-prevent style={{"overflow":"hidden","overscrollBehavior":"contain","borderRadius":"0.5rem","borderWidth":"1px","borderColor":"rgb(0,0,0,0.3)","backgroundColor":"rgb(255,255,255)"}}>
      <textarea
        aria-label="Product description"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => event.stopPropagation()}
        onWheel={(event) => event.stopPropagation()}
        placeholder="Write a product description"
        rows={6}
        style={{"boxSizing":"border-box","display":"block","height":"11rem","maxHeight":"11rem","width":"100%","resize":"none","overflowY":"auto","borderWidth":"0px","backgroundColor":"transparent","padding":"0.75rem","fontSize":"0.875rem","lineHeight":"1.5rem","outline":"2px solid transparent","outlineOffset":"2px","boxShadow":"0 0 0 0px #fff,   0 0 0 calc(2px + 0px) rgb(59,130,246,0.5), 0 0 #0000"}}
      />
    </div>
  );
}
