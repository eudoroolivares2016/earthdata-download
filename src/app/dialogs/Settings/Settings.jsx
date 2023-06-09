import React, { useContext, useState, useEffect } from 'react'
import {
  FaFolder
} from 'react-icons/fa'
import PropTypes from 'prop-types'

import MiddleEllipsis from 'react-middle-ellipsis'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'

import * as styles from './Settings.module.scss'

import Input from '../../components/Input/Input'

import Button from '../../components/Button/Button'

import { ElectronApiContext } from '../../context/ElectronApiContext'
/**
 * @typedef {Object} InitializeDownloadProps
 * @property {Boolean} hasActiveDownloads A boolean representing flag if user has downloads in active state
 */

/**
 * Renders a `Settings` dialog.
 * @param {Settings} props
 *
 * @example <caption>Render a Settings dialog.</caption>
 *
 * const [hasActiveDownload, setHasActiveDownload] = useState(false)
 *
 * return (
 *  <Dialog {...dialogProps}>
 *    <Settings
 *      hasActiveDownload = {hasActiveDownload}
 *    />
 *  </Dialog>
 * )
 */
const Settings = ({
  hasActiveDownloads
}) => {
  const {
    chooseDownloadLocation,
    setDownloadLocation,
    setPreferenceFieldValue,
    getPreferenceFieldValue
  } = useContext(ElectronApiContext)
  const [concurrentDownloads, setConcurrentDownloads] = useState('5')
  const [defaultDownloadLocation, setDefaultDownloadLocation] = useState()

  const onClearDefaultDownload = () => {
    setDefaultDownloadLocation(undefined)
    setPreferenceFieldValue('defaultDownloadLocation', undefined)
  }

  const onSetChooseDownloadLocation = () => {
    chooseDownloadLocation()
  }

  const onChangeConcurrentDownloads = (event) => {
    const { value } = event.target
    // if value is non numerical and can't be parsed as an integer return 0
    const valueNumeric = parseInt(value, 10) || 0
    if (value === '') {
      setConcurrentDownloads('')
      return
    }
    // Allow set if non-decimal value and > 0 allow setting of the text field
    if (valueNumeric > 0 && value.indexOf('.') < 0) {
      setConcurrentDownloads(valueNumeric.toString())
    }
  }
  // Event occurs when element loses focus, write to preferences.json
  const onBlurConcurrentDownloads = async (event) => {
    const { value } = event.target
    // If empty string is entered and the input field is exited, restore the label with the set concurrentDownloads
    if (value === '') {
      const concurrentDownloadsPreference = await getPreferenceFieldValue('concurrentDownloads')
      setConcurrentDownloads(concurrentDownloadsPreference.toString())
      return
    }

    const valueNumeric = parseInt(value, 10)
    if (valueNumeric > 0) {
      setPreferenceFieldValue('concurrentDownloads', valueNumeric)
    }
  }

  const onSetDownloadLocation = (event, info) => {
    const { downloadLocation: newDownloadLocation } = info
    setDefaultDownloadLocation(newDownloadLocation)
    setPreferenceFieldValue('defaultDownloadLocation', newDownloadLocation)
  }

  useEffect(
    () => {
      const fetchDefaultDownloadLocation = async () => {
        setDefaultDownloadLocation(await getPreferenceFieldValue('defaultDownloadLocation'))
      }
      fetchDefaultDownloadLocation()
    },
    [setDefaultDownloadLocation]
  )

  useEffect(() => {
    const fetchConcurrency = async () => {
      const concurrentDownloads = await getPreferenceFieldValue('concurrentDownloads')
      setConcurrentDownloads(concurrentDownloads.toString())
    }
    fetchConcurrency()
  }, [setConcurrentDownloads])

  // Handle the response from the setDownloadLocation
  useEffect(() => {
    setDownloadLocation(true, onSetDownloadLocation)
    return () => {
      setDownloadLocation(false, onSetDownloadLocation)
    }
  }, [])

  return (
    <div>
      Number of Concurrent Downloads:
      {' '}
      {concurrentDownloads}
      <br />
      Download location:
      {' '}
      {defaultDownloadLocation}

      <Input
        type="text"
        onChange={onChangeConcurrentDownloads}
        value={concurrentDownloads}
        label="Set Concurrency"
        onBlur={onBlurConcurrentDownloads}
      />

      <button
        className={styles.downloadLocationButton}
        type="button"
        onClick={onSetChooseDownloadLocation}
        data-testid="initialize-download-location"
        aria-label="Choose another folder"
      >
        Select Download Location
      </button>
      <span className={styles.downloadLocationWrapper}>
        <FaFolder />
        <VisuallyHidden>
          <span>{`${defaultDownloadLocation}`}</span>
        </VisuallyHidden>
        <MiddleEllipsis key={defaultDownloadLocation}>
          <span
            className={styles.downloadLocationText}
            aria-hidden="true"
          >
            {defaultDownloadLocation}
          </span>
        </MiddleEllipsis>
      </span>

      <Button
        size="md"
        onClick={onClearDefaultDownload}
        dataTestId="settings-clear-default-download"
        className={styles.settingsClearDefaultDownload}
      >
        Clear default download location
      </Button>
      { hasActiveDownloads
        ? (
          <div className={styles.activeDownloadsWarn} data-testid="settings-hasActiveDownloads">
            Currently running Downloads
          </div>
        )
        : (
          null
        )}

    </div>
  )
}

Settings.propTypes = {
  hasActiveDownloads: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number
  ]).isRequired
}

export default Settings
