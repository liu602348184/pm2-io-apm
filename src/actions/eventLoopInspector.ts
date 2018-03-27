import debug from 'debug'
debug('axm:profiling')

import utils from '../utils/module'
import ActionsFeature from '../features/actions'

export default class Inspector {

  private MODULE_NAME = 'event-loop-inspector'
  private actionFeature: ActionsFeature

  constructor (actionFeature: ActionsFeature) {
    this.actionFeature = actionFeature
  }

  async eventLoopDump () {
    return new Promise( (resolve, reject) => {
      utils.detectModule(this.MODULE_NAME, (err, inspectorPath) => {

        if (err) {
          console.error(err)
          return reject(err)
        }

        const res = this.exposeActions(inspectorPath)

        if (res instanceof Error) {
          return reject(res)
        }
        return resolve()
      })
    })
  }

  private exposeActions (inspectorPath) {
    let inspector = utils.loadModule(inspectorPath, this.MODULE_NAME)

    if (inspector instanceof Error || !inspector) {
      return inspector
    }

    /**
     * Heap snapshot
     */
    return this.actionFeature.action('km:event-loop-dump', function (reply) {
      const dump = inspector.dump()

      return reply({
        success: true,
        dump: dump
      })
    })
  }
}
