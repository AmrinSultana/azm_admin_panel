import * as admin from 'firebase-admin'

describe('updateUserLocation Firestore Cloud Function (onCreate)', () => {
  let adminInitStub
  let updateUserLocation

  before(() => {
    adminInitStub = sinon.stub(admin, 'initializeApp')
    /* eslint-disable global-require */
    updateUserLocation = functionsTest.wrap(
      require(`${__dirname}/../../index`).updateUserLocation
    )
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring stubs to the original methods
    functionsTest.cleanup()
    adminInitStub.restore()
  })

  it('handles event', async () => {
    // const fakeEvent = functionsTest.firestore.makeDocumentSnapshot({foo: 'bar'}, 'document/path');
    const fakeEvent = functionsTest.firestore.exampleDocumentSnapshot()
    const fakeContext = { params: {} }
    const res = await updateUserLocation(fakeEvent, fakeContext)
    expect(res).to.be.null
  })
})
