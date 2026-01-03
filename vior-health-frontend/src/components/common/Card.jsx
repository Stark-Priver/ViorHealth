import clsx from 'clsx';

const Card = ({ children, className, title, action, hoverable = false }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-neutral-200 p-6',
        hoverable && 'hover:shadow-md transition-shadow duration-200',
        className
      )}
    >
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
