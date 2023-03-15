import s from './Button.module.css';
import PropTypes from 'prop-types';

export default function Button({ onClick, isLoading }) {
    return (
        <button
            type="button"
            className={s.Button}
            onClick={onClick}
            disabled={isLoading}
            >Load more</button>
    )
}

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    isLoading: PropTypes.bool,
}