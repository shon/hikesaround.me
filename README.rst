setup
-----

.. code-block:: bash

    mkvirtualenv -p /usr/bin/python3 ham
    pip install -r pip-requirements.txt
    cd fe
    npm install
    cp dev-settings.py settings.py
    # Add Facebook App Id and App Secret

build
-----

.. code-block:: bash

    cd fe; ./node_modules/.bin/gulp clean; ./node_modules/.bin/gulp build; cd ..

.. code-block:: python

    >>> import puller
    >>> puller.pull_all_events()
    >>> puller.pull_all_events(1, 5)  # for testing

run
---

.. code-block:: bash

    python service.py


test
----

.. code-block:: bash

    firefox http://127.0.0.1:8000
