type HomeShowcaseToggleProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export function HomeShowcaseToggle({ checked, onCheckedChange }: HomeShowcaseToggleProps) {
  return (
    <div style={{"display":"flex","alignItems":"flex-start","justifyContent":"space-between","gap":"1rem"}}>
      <div>
        <p style={{"fontSize":"0.875rem","lineHeight":"1.25rem","fontWeight":"500","color":"rgb(0,0,0,0.8)"}}>Show in Best Sellers</p>
        <p style={{"marginTop":"0.25rem","fontSize":"0.75rem","lineHeight":"1.25rem"}}>
          Add this product to the Best Sellers carousel on the home page.
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Show in Best Sellers"
        onClick={() => onCheckedChange(!checked)}
        className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${
          checked ? "bg-black" : "bg-black/20"
        }`}
      >
        <span
          aria-hidden="true"
          className={`size-5 rounded-full bg-white shadow-sm transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
