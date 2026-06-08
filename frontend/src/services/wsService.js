import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

class WebSocketService {
  constructor() {
    this.client = null
    this.subscriptions = {}
  }

  connect(token) {
    return new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        onConnect: () => {
          console.log('WebSocket conectado')
          resolve()
        },
        onStompError: (error) => {
          console.error('Error STOMP:', error)
          reject(error)
        },
      })
      this.client.activate()
    })
  }

  disconnect() {
    if (this.client && this.client.connected) {
      this.client.deactivate()
      this.subscriptions = {}
    }
  }

  suscribirse(destino, callback) {
    if (this.client && this.client.connected) {
      const subscription = this.client.subscribe(destino, (message) => {
        callback(JSON.parse(message.body))
      })
      this.subscriptions[destino] = subscription
      return subscription
    }
  }

  publicar(destino, mensaje) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: destino,
        body: JSON.stringify(mensaje),
      })
    }
  }

  desuscribirse(destino) {
    if (this.subscriptions[destino]) {
      this.subscriptions[destino].unsubscribe()
      delete this.subscriptions[destino]
    }
  }
}

export const wsService = new WebSocketService()
