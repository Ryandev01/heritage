import ItemDetached from '../../../assets/images/searchResults/ItemDetached.svg';
import ItemAttached from '../../../assets/images/searchResults/ItemAttached.svg';
import {
    Box,
} from "@mui/material";
import { DetachedIconTypes } from '../../../types/SearchResultsTabsProps';
import styles from './index.module.css'
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

const DetachedIcon = ({
    className,
    style,
    onClick,
    shouldShowAttachIcon = false
}: DetachedIconTypes) => {
    const { isAssociationsIconsDisabled } = useSelector(
        (state: RootState) => state.searchResults
    );

    const classList = `${styles['detach-icon-component']}` +
    ` ${className ? `${className} ${styles[className]}` : ''}`+ 
    ` ${!shouldShowAttachIcon ? styles['animator'] : ''}` + 
    ` ${isAssociationsIconsDisabled ? styles['disabled'] : ''}`

    return (
        <Box
            className={classList}
            style={{
                ...style,
            }}
            component={"img"}
            src={shouldShowAttachIcon ? ItemAttached : ItemDetached}
            alt="ItemDetached"
            onClick={e => {
                onClick(e)
            }}
        >
        </Box>
    );
}

export default DetachedIcon;