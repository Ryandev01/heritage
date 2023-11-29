
import { isEmptyValue, NO_TEXT } from '../../../utils/services/helpers';

type RenderValueWithDefaultType = (value: string | number | Array<string> | []) => React.ReactNode

const RenderValueWithDefault: RenderValueWithDefaultType = (value) => {
    return <>
        {
            !isEmptyValue(value) ?
                <span>
                    {
                        value && Array.isArray(value) ? value.join(', ') : value
                    }
                </span> :
                <span style={{
                    color: 'var(--medium-gray)'
                }}>
                    {NO_TEXT}
                </span>
        }
    </>;
}
 
export default RenderValueWithDefault;