import test from 'ava'
import { transformer } from '../src'

test('transformer', (t) => {
  let ast = {
    type: 'Program',
    body: [
      {
        type: 'CallExpression',
        name: 'add',
        params: [
          {
            type: 'CallExpression',
            name: 'add',
            params: [
              {
                type: 'NumberLiteral',
                value: '3'
              },
              {
                type: 'NumberLiteral',
                value: '5'
              }
            ]
          },
          {
            type: 'CallExpression',
            name: 'substract',
            params: [
              {
                type: 'NumberLiteral',
                value: '42'
              },
              {
                type: 'NumberLiteral',
                value: '3'
              }
            ]
          }
        ]
      }
    ]
  }

  let expected = {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: 'add'
          },
          arguments: [
            {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'add'
              },
              arguments: [
                {
                  type: 'NumberLiteral',
                  value: '3'
                },
                {
                  type: 'NumberLiteral',
                  value: '5'
                }
              ]
            },
            {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'substract'
              },
              arguments: [
                {
                  type: 'NumberLiteral',
                  value: '42'
                },
                {
                  type: 'NumberLiteral',
                  value: '3'
                }
              ]
            }
          ]
        }
      }
    ]
  }

  let next_ast = transformer(ast)

  t.deepEqual(next_ast, expected)
})
