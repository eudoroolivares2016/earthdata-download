import downloadStates from './downloadStates'

const humanizedDownloadStates = {
  [downloadStates.active]: 'Downloading',
  [downloadStates.completed]: 'Completed',
  [downloadStates.error]: 'An error occurred',
  [downloadStates.interrupted]: 'Interrupted',
  [downloadStates.paused]: 'Paused',
  [downloadStates.pending]: 'Initializing'
}

const getHumanizedDownloadStates = (state, percent = 0, hasErrors = false) => {
  if (state === downloadStates.waitingForAuth) {
    if (percent > 0) return humanizedDownloadStates[downloadStates.interrupted]

    return humanizedDownloadStates[downloadStates.pending]
  }

  return `${humanizedDownloadStates[state]}${hasErrors ? ' with errors' : ''}`
}

export default getHumanizedDownloadStates
