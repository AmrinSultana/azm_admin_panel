import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';

import { SearchInput } from 'components';

const useStyles = makeStyles(theme => ({
  root: {},
  row: {
    height: '42px',
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1)
  },
  spacer: {
    flexGrow: 1
  },
  importButton: {
    marginRight: theme.spacing(1)
  },
  exportButton: {
    marginRight: theme.spacing(1)
  },
  searchInput: {
    marginRight: theme.spacing(1)
  }
}));

const TeamsToolbar = props => {
  const { className, onAddTeamClick, onSearchUser, showAddTeam, ...rest } = props;

  const classes = useStyles();

  return (
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <div className={classes.row}>
        <span className={classes.spacer} />
        <Button
          onClick={onAddTeamClick}
          color="primary"
          variant="contained"
          disabled={!showAddTeam}
        >
          Add Team
        </Button>
      </div>
      {/* <div className={classes.row}>
        <SearchInput
          className={classes.searchInput}
          placeholder="Search user by UID/Name"
          onChange={onSearchUser}
        />
      </div> */}
    </div>
  );
};

TeamsToolbar.propTypes = {
  className: PropTypes.string
};

export default TeamsToolbar;
