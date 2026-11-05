import assert from 'node:assert/strict'
import test from 'node:test'
import { hashPassword, comparePassword } from '../src/utils/password.js'

test('password hashing does not preserve the raw password', async () => {
  const hash = await hashPassword('correct horse battery staple')
  assert.notEqual(hash, 'correct horse battery staple')
  assert.equal(await comparePassword('correct horse battery staple', hash), true)
  assert.equal(await comparePassword('wrong password', hash), false)
})
