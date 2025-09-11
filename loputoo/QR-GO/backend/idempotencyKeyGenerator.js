const {
    scryptSync,
  } = await import('node:crypto')
  // Using the factory defaults.
  const ss = Math.random(32).toString()
  // Using a custom N parameter. Must be a power of two.
  export const idKey = scryptSync('password', ss, 20, { N: 16384 })
  console.log(idKey.toString('hex'))
