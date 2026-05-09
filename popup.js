
let currentHost = '';

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if(tabs[0] && tabs[0].url) {
            try {
                const url = new URL(tabs[0].url);
                currentHost = url.hostname;
                document.getElementById('current-site').textContent = currentHost;
                loadProfile(currentHost);
            } catch(e) {
                document.getElementById('current-site').textContent = "Недопустимый URL";
            }
        }
    });

    document.getElementById('saveBtn').addEventListener('click', saveProfile);
    document.getElementById('clearBtn').addEventListener('click', clearProfile);
});

function loadProfile(host) {
    if(!host) return;
    chrome.storage.sync.get(['profiles'], function(result) {
        const profiles = result.profiles || {};
        const config = profiles[host] || { level: 0, disabledElements: '', breakTranslators: false };
        
        document.getElementById('level').value = config.level;
        document.getElementById('disabled').value = config.disabledElements;
        document.getElementById('breakTranslators').checked = config.breakTranslators;
    });
}

function saveProfile() {
    if(!currentHost) return;
    const config = {
        level: parseInt(document.getElementById('level').value),
        disabledElements: document.getElementById('disabled').value,
        breakTranslators: document.getElementById('breakTranslators').checked
    };

    chrome.storage.sync.get(['profiles'], function(result) {
        const profiles = result.profiles || {};
        profiles[currentHost] = config;
        chrome.storage.sync.set({profiles: profiles}, function() {
            showStatus('Профиль применен!');
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'applyProfile', config: config});
            });
        });
    });
}

function clearProfile() {
    if(!currentHost) return;
    chrome.storage.sync.get(['profiles'], function(result) {
        const profiles = result.profiles || {};
        delete profiles[currentHost];
        chrome.storage.sync.set({profiles: profiles}, function() {
            document.getElementById('level').value = 0;
            document.getElementById('disabled').value = '';
            document.getElementById('breakTranslators').checked = false;
            
            showStatus('Профиль очищен');
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {action: 'applyProfile', config: { level: 0, disabledElements: '', breakTranslators: false }});
            });
        });
    });
}

function showStatus(msg) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = msg;
    setTimeout(() => { statusEl.textContent = ''; }, 2000);
}
