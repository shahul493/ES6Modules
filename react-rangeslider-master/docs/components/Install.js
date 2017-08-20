import React from 'react'
import Codeblock from './Codeblock'

function Install () {
  return (
    <section className='block install'>
      <h2>Installation</h2>
      <p>
        Using npm (use <code>--save</code> to include it in your package.json)
      </p>
      <Codeblock>
        {`$ npm install react-rangeslider --save`}
      </Codeblock>
      <p>
        Using yarn (use <code>--dev</code> to include it in your package.json)
      </p>
      <Codeblock>
        {`$ yarn add react-rangeslider --save`}
      </Codeblock>
    </section>
  )
}

export default Install
