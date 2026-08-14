function SearchBar({
  value,
  onChange,
  onKeyDown,
  placeholder = "Search movies...",
}) {
  return (
    <div className="search-wrapper">
      <span className="search-icon">⌕</span>
      <input
        className="search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label="Search movies"
      />
    </div>
  );
}

export default SearchBar;
