import * as AWS from 'aws-sdk';

const sqsClient = new AWS.SQS();


const handler = async () => {

    const queuUrl = process.env.QUEUE_URL!;

    const records = await sqsClient.receiveMessage({
        QueueUrl: queuUrl,
        MaxNumberOfMessages: 3,
        WaitTimeSeconds: 2
    }).promise();

    console.log('messagesRead:', records.Messages);

    if((records.Messages?.length ?? 0 )> 1){
        const deleteResult = await sqsClient.deleteMessage({
            QueueUrl: queuUrl,
            ReceiptHandle: records.Messages![1].ReceiptHandle!
        }).promise();

        console.log('deleteResult: ', deleteResult);
    }
};

exports.handler = handler;