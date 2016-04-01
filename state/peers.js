'use strict'
const AndCollection = require ('ampersand-collection')
const bind = require('lodash.bind')
const PeerJS = require ('peerjs')

const Peer = require ('./peer')

const Peers = AndCollection.extend ({
    model: Peer,
    mainIndex: 'uuid',

    session: {
        peer: 'object',
        id: 'string',
    },
    initialize: function () {
        if (!this.peer) this.peer = new PeerJS ({
            key: 'bv00je62msdr6bt9',
            debug: 3,
        })

        let peers = this

        this.peer.on ('disconnected', bind (this.trigger, this, 'disconnected'))
        this.peer.on ('close',        bind (this.trigger, this, 'close'))
        this.peer.on ('error',        bind (this.trigger, this, 'error'))
        this.peer.on ('connection',   bind (this.trigger, this, 'connection'))

        this.peer.on ('open', function (id) {
            peers.id = id
            peers.trigger ('ready', id)
        })

        this.on ('connection', function (data) {
            this.add ({
                id: data.id,
                data: data, // add the data connection
            })
        })
    },
})

module.exports = Peers