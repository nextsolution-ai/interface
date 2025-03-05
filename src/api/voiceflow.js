import axios from 'axios';

export const interact = async (user_id, request, apiKey = 'VF.DM.67c85533afdb459652c6488d.s4Xd2YebJqSNWjES') => {
    console.log('🚀 Sending request:', { user_id, request });
    
    try {
        const response = await axios.post(
            `https://general-runtime.voiceflow.com/state/user/${user_id}/interact`,
            { request: request },
            {
                headers: {
                    'Authorization': apiKey,
                    'versionID': 'production',
                    "accept": "application/json",
                    "content-type": "application/json"
                }
            }
        );

        console.log('📥 Raw API Response:', response.data);

        const traces = response.data;
        let result = {
            messages: [],
            buttons: [],
            images: [],
            isEnded: false
        };

        for (let trace of traces) {
            console.log('🔍 Processing trace:', { type: trace.type, payload: trace.payload });

            if (trace.type === 'text') {
                result.messages.push(trace.payload.message);
            } else if (trace.type === 'choice') {
                // Store the entire request object for each button
                result.buttons = trace.payload.buttons.map(button => ({
                    name: button.name,
                    request: button.request // Store the complete request object
                }));
                console.log('📋 Processed buttons:', result.buttons);
            } else if (trace.type === 'visual') {
                // Handle image traces
                console.log('🖼️ Processing image:', trace.payload);
                result.images.push(trace.payload.image);
            } else if (trace.type === 'end') {
                result.isEnded = true;
            } else {
                console.warn('⚠️ Unhandled trace type:', {
                    type: trace.type,
                    payload: trace.payload
                });
            }
        }

        console.log('✅ Processed result:', result);
        return result;
    } catch (error) {
        console.error('❌ Error interacting with Voiceflow:', error);
        return null;
    }
};

export const saveTranscript = async (user_id, message, config = {
    apiKey: 'VF.DM.67c85533afdb459652c6488d.s4Xd2YebJqSNWjES',
    projectId: '67c855152108cc3a1af64b96',
    versionId: '67c855152108cc3a1af64b97'
}) => {
    console.log('💾 Saving transcript:', { user_id, message });
    
    try {
        const response = await axios.put(
            'https://api.voiceflow.com/v2/transcripts',
            {
                projectID: config.projectId,
                versionID: config.versionId,
                sessionID: user_id,
                messages: message
            },
            {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json',
                    'Authorization': config.apiKey
                }
            }
        );

        console.log('📝 Transcript saved:', response.status);
    } catch (error) {
        console.error('❌ Error saving transcript:', error);
    }
};
