import {ImporterModes, ImporterParams, JwtAuthenticationParams, SimpleClientIdAuthenticationParams} from "./types";
import {ErrorMessages} from "./errorMessages";

const IFRAME_ID = "__dolphincsv__iframe"
const IFRAME_URL = import.meta.env.VITE_IFRAME_URL as string || 'https://dolphincsv.com/embed'


export class DolphinCSVImporter {

  _iframe?: HTMLIFrameElement
  _parent?: HTMLElement
  _launched = false
  _completed = false
  _error = false
  _closed = false
  _mode: ImporterModes = 'development'
  _loadingElement?: HTMLElement
  _iframeHasLoaded = false
  _maxLaunchRetries = 5
  _clientId?
  _iFrameClassName
  _columns?
  _templateKey?
  _onSuccess
  _onError
  _onClose

  constructor(params: ImporterParams) {
    if (params.mode === undefined) throw new Error(ErrorMessages.noMode)
    if (params.mode !== 'demo' && !params.templateKey) throw new Error(ErrorMessages.noTemplateKey)
    if (params.mode !== 'demo' && !params.columns?.length) throw new Error(ErrorMessages.noColumns)

    this._mode = params.mode
    this._iFrameClassName = params.iFrameClassName
    this._onSuccess = params.onSuccess
    this._onError = params.onError
    this._onClose = params.onClose

    if (params.mode !== 'demo') {
      this._clientId = params?.clientId
      this._templateKey = params?.templateKey


      const columns = params?.columns || [];

      const colLabels = columns.map(col => col.label)
      const colKeys = columns.map(col => col.key)

      if (colLabels.length !== [...new Set(colLabels)].length) {
        throw new Error('Column labels must be unique')
      }

      if (colKeys.length !== [...new Set(colKeys)].length) {
        throw new Error('Column labels must be unique')
      }

      if (!columns.length || typeof columns !== 'object') {
        throw new Error('columns must be a non-empty array')
      }


      columns.forEach((col) => {
        if (!col.type || !col.key) {
          throw new Error('Each column must have a type and a key.')
        }

        if (typeof col.key !== 'string') {
          throw new TypeError(`Column keys must be strings. Column key ${col.key} is not a string.`)
        }

        if (![
          'text',
          'email',
          'url',
          'phone',
          'usPhone',
          'us_postcode',
          'picklist',
          'number',
          'percentage',
          'boolean',
          'date',
          'datetime',
        ].includes(col.type)) {
          throw new Error(`Column type ${col.type} is not recognized. Please refer to https://docs.dolphincsv.com/configuring-columns.`)
        }

        if (col.type !== 'picklist') {
          return
        }

        if (!col.meta.options?.length) {
          throw new Error('Picklist columns must contain a non-empty `options` array in the `meta` object. Please refer to https://docs.dolphincsv.com/configuring-columns.')
        }

        const labels =  col.meta.options.map(o => o?.label || '')
        const values =  col.meta.options.map(o => o?.value || '')

        if (labels.length !== [...new Set(labels)].length) {
          throw new Error('Picklist option labels must be unique')
        }

        if (values.length !== [...new Set(values)].length) {
          throw new Error('Picklist option labels must be unique')
        }
      })

      this._columns = columns
    }
  }

  launch() {

    const parent = document.createElement('div')
    parent.style.position = 'fixed'
    parent.style.top = '0'
    parent.style.left = '0'
    parent.style.width = '100%'
    parent.style.height = '100%'
    parent.style.backgroundColor = 'rgba(0,0,0, 0.3)'
    parent.style.display = 'flex'
    parent.style.justifyContent = 'center'
    parent.style.alignItems = 'center'

    const loadingElement = document.createElement('div')
    loadingElement.style.position = 'absolute'
    loadingElement.style.top = '5%'
    loadingElement.style.left = '5%'
    loadingElement.style.width = '90%'
    loadingElement.style.height = '90%'
    loadingElement.style.backgroundColor = 'white'
    loadingElement.innerText = 'Loading...'
    loadingElement.style.zIndex = '-1'
    loadingElement.style.display = 'flex'
    loadingElement.style.justifyContent = 'center'
    loadingElement.style.alignItems = 'center'
    loadingElement.style.borderRadius = '1rem'

    this._loadingElement = loadingElement

    parent.appendChild(loadingElement)

    document.body.append(parent)

    this._parent = parent

    this._setupIframe(parent)


    this._setupListeners()
    this._sendLaunchMessageWithRetry()

  }

  close() {
    this._removeSelf()
  }

  _setupListeners() {
    if (this._iframe !== undefined) {
      this._iframe.onload = () => {
        this._iframeHasLoaded = true
      }
    }

    window.addEventListener('message', (e) => {
      switch (e.data.type) {
        case 'launched':
          this._launched = true
          break
        case 'completed':
          this._completed = true
          this._launched = false
          this._onSuccess(e.data)
          this._removeSelf()
          break
        case 'closed':
          this._launched = false
          this._removeSelf()
          this._onClose()
          break
        case 'error':
          this._error = true
          this._onError(e.data.message)
          break
        default:
          return
      }

    })
  }

  _removeSelf() {
    if (this._parent){
      this._parent.remove()
    }

    this._closed = true
    this._iframe = undefined
    this._iframeHasLoaded = false
  }

  _sendLaunchMessageWithRetry(retryCount = 0) {
    const initMessage = {
      client_id: this._clientId,
      // customizationKey,
      // customizationOverrides,
      template_key: this._templateKey,
      columns: this._columns,
      mode: this._mode,
    }
    if (this._launched) return

    if (retryCount >= this._maxLaunchRetries) {
      if (this._mode === 'development') {
        console.warn(ErrorMessages.launchFailed)
      }
      return
    }

    if (this._iframe !== undefined && this._iframeHasLoaded) {
      const iframeContentWindow = this._iframe.contentWindow;
      if (iframeContentWindow !== null) {
        try {
          iframeContentWindow.postMessage(initMessage, IFRAME_URL)
        } catch (e) {
          if (this._mode === 'development') {
            console.log(e)
          }
        }

      } else {
        if (!this._closed) {
          throw new Error(ErrorMessages.iFrameEmpty)
        }
      }
    }

    setTimeout(() => this._sendLaunchMessageWithRetry(retryCount + 1), 1000)
  }

  _setupIframe(parent?: HTMLElement) {
    let iframe = document.getElementById(IFRAME_ID) as HTMLIFrameElement
    if (!iframe) {
      iframe = document.createElement("iframe")
      iframe.id = IFRAME_ID
    }


    iframe.src = this._mode === 'demo' ? IFRAME_URL + '?demo=true' : IFRAME_URL
    iframe.className = this._iFrameClassName || ''
    iframe.style.width = '90%'
    iframe.style.height = '90%'
    iframe.style.borderWidth = '0px'
    this._iframe = iframe

    if (parent) {
      parent.appendChild(iframe)
    } else {
      document.body.append(iframe)
    }
  }

  _isUsingJwtAuthentication(
    auth: JwtAuthenticationParams | SimpleClientIdAuthenticationParams
  ): auth is JwtAuthenticationParams {
    return (auth as JwtAuthenticationParams).jwt !== undefined;
  }
}
