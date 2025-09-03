import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { TitleText, IconButton, Icon, IconType, Button, Text } from '@/ui';
import styles from './styles.module.css';

type Props = {
  action?: () => void;
  iconType?: IconType;
  title?: string;
  comment?: string;
  commentDescription?: string;
};
const EmptyBuilds = ({
  title,
  iconType,
  comment,
  action,
  commentDescription,
}: Props) => {
  const { t } = useTranslation();
  const [_, setSearchParams] = useSearchParams();

  const onCreate = () => {
    setSearchParams({ mode: 'create', id: 'new' });
  };

  return (
    <>
      <div className={styles.header}>
        <TitleText type='h2'>{title ? title : t('Build.title')}</TitleText>
      </div>
      <div className={styles.emptyContainer}>
        <div className={styles.emptyBtn}>
          <IconButton variant='transparent' size='full'>
            <Icon
              type={iconType ? iconType : IconType.Builder}
              width='70'
              height='80'
              fill='var(--oliver-blue)'
            />
          </IconButton>
        </div>
        <div className={styles.emptyText}>
          <TitleText type='h3'>
            {comment ? comment : t('Build.build_empty_title')}
          </TitleText>
          <div className={styles.subText}>
            <Text weight='light-medium' color='base-blue'>
              {commentDescription
                ? commentDescription
                : t('Build.build_empty_text')}
            </Text>
          </div>
        </div>
        <Button
          variant='primary'
          icon={true}
          onClick={action ? action : onCreate}
          size='large'
        >
          <Icon type={IconType.Plus} width={24} height={24} />
          <span>{t('Shared.create_new')}</span>
        </Button>
      </div>
    </>
  );
};

export default EmptyBuilds;
