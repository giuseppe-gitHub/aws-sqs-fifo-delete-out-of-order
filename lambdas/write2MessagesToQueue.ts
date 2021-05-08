import * as AWS from 'aws-sdk';

const sqsClient = new AWS.SQS();

const handler = async (input: {num: number}) => {

    const queuUrl = process.env.QUEUE_URL!;

    const sendResult = await sqsClient.sendMessageBatch({
        QueueUrl: queuUrl,
        Entries: [
            {
                Id: `${input.num}`,
                MessageBody: `body-${input.num}`,
                MessageGroupId: 'groupId'
            },
            {
                Id: `${input.num+1}`,
                MessageBody: `body-${input.num+1}`,
                MessageGroupId: 'groupId'
            }
        ]
    }).promise();

    console.log('sendResult', sendResult);
};

exports.handler = handler;