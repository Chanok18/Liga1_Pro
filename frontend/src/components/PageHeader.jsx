export function PageHeader({ eyebrow, title, description, icon: Icon, action }) {
  return (
    <header className="page-header">
      <div>
        <div className="eyebrow">
          {Icon ? <Icon className="h-4 w-4" /> : null}
          <span>{eyebrow}</span>
        </div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="page-header-action">{action}</div> : null}
    </header>
  )
}
